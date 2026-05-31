const { extractInvoiceData } = require('../../infrastructure/ai/prompts/GeminiExtractor');
const validateInvoice    = require('../../application/useCases/ValidateInvoice');

const uploadInvoice = async (req, res, next) => {

  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error:'לא הועלה קובץ — יש לצרף קובץ PDF',
      });
    }

    const filePath = req.file.path;
    //חילוץ נתונים מה-PDF באמצעות Gemini
    const extractedData = await extractInvoiceData(filePath);
    const invoice = await validateInvoice(extractedData, filePath);
    return res.status(201).json({
      success: true,
      data:    invoice,
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {uploadInvoice};
