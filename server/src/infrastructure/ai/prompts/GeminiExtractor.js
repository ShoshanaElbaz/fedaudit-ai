const { GoogleGenerativeAI } = require('@google/generative-ai');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

const buildPrompt = (invoiceText) => `
CRITICAL: Return ALL values in English only. Never translate field values to Hebrew.
Examples: destination="Germany" NOT "גרמניה" | zone="R" NOT "ר" | packaging="Other packaging" NOT "אריזות אחרות" | service="IE" NOT "כלומר"
אתה מומחה לניתוח חשבוניות FedEx ישראל.
קרא את החשבונית הבאה והחזר JSON בלבד.
ללא טקסט נוסף, ללא הסברים, ללא markdown, ללא backticks.

חוקים חשובים לחילוץ:
1. direction: אם השולח בישראל והיעד בחו"ל → "export" | אם ההפך → "import"
2. service: חלץ בדיוק — IP / IPE / IE / IPF / IEF / FIF / FICP
3. destination: שם המדינה באנגלית בלבד — Germany ולא DE
4. zone: חלץ אם מופיע בחשבונית, אחרת null
5. dimensions: חלץ אם מופיעות, אחרת null לכל שדה
6. surcharges: חלץ את כל התוספות — AHS, Fuel, ADG, IDG, Dry Ice
7. currency: USD או ILS בלבד
8. אם שדה לא קיים — שים null ולא מחרוזת ריקה

החזר בפורמט הזה בדיוק:
{
  "invoiceNumber": "מספר החשבונית",
  "invoiceDate": "תאריך בפורמט YYYY-MM-DD",
  "direction": "export או import",
  "shipments": [
    {
      "trackingNumber": "מספר המעקב המלא",
      "service": "סוג השירות",
      "destination": "מדינת היעד באנגלית",
      "zone": "האזור או null",
      "actualWeight": 0.0,
      "dimensions": {
        "l": null,
        "w": null,
        "h": null
      },
      "chargeableWeight": 0.0,
      "packaging": "סוג האריזה",
      "baseRate": 0.0,
      "surcharges": [
        {
          "type": "שם התוספת",
          "amount": 0.0,
          "currency": "USD או ILS"
        }
      ]
    }
  ]
}

החשבונית:
${invoiceText}
`;


const cleanGeminiResponse = (text) => {
  return text.replace(/```json/gi, '').replace(/```/g, '').replace(/`/g, '').trim();                   
};


const validateExtractedData = (data) => {

  // בודק שיש מספר חשבונית
  if (!data.invoiceNumber) {
    throw new Error('Gemini לא הצליח לחלץ מספר חשבונית');
  }

  // בודק שיש כיוון משלוח
  if (!['export', 'import'].includes(data.direction)) {
    throw new Error('Gemini החזיר direction לא תקין');
  }

  // בודק שיש לפחות משלוח אחד
  if (!data.shipments || data.shipments.length === 0) {
    throw new Error('Gemini לא מצא משלוחים בחשבונית');
  }

  // בודק כל משלוח בנפרד
  data.shipments.forEach((shipment, index) => {
    if (!shipment.trackingNumber) {
      throw new Error(`משלוח ${index + 1} חסר מספר מעקב`);
    }
    if (!shipment.service) {
      throw new Error(`משלוח ${index + 1} חסר סוג שירות`);
    }
    if (!shipment.destination) {
      throw new Error(`משלוח ${index + 1} חסר מדינת יעד`);
    }
  });

};

const extractInvoiceData = async (filePath) => {
  try {

    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    const invoiceText = pdfData.text;
    if (!invoiceText || invoiceText.trim().length === 0) {
      throw new Error('לא הצלחנו לחלץ טקסט מה-PDF');
    }
    const prompt = buildPrompt(invoiceText);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedText = cleanGeminiResponse(responseText);
    const extractedData = JSON.parse(cleanedText);
    validateExtractedData(extractedData);
    return extractedData;
  } catch (error) {
  if (error instanceof SyntaxError) {
      throw new Error('Gemini החזיר תשובה שאינה JSON תקין');
    }

    throw new Error(`שגיאה בחילוץ נתוני החשבונית: ${error.message}`);
  }
};

module.exports = { extractInvoiceData };





