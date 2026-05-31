const Invoice = require('../../infrastructure/db/mongoose/models/InvoiceModel');
const zoneValidator           = require('../validators/ZoneValidator');
const chargeableWeightValidator = require('../validators/ChargeableWeightValidator');
const baseRateValidator       = require('../validators/BaseRateValidator');
const ahsWeightValidator      = require('../validators/AHSWeightValidator');
const dangerousGoodsValidator = require('../validators/DangerousGoodsValidator');


const validateInvoice = async (extractedData, filePath) => {

  //קביעת כייון המשלוח
  const direction = extractedData.direction || 'export';

  //  הרצת 5 הבדיקות על כל משלוח
  const validatedShipments = extractedData.shipments.map(shipment => {

    // בדיקה 1 — אימות Zone
    const zoneResult = zoneValidator.validate(shipment, direction);

    // בדיקה 2 — אימות משקל לחיוב
    // חשוב: מעדכנת את shipment.chargeableWeight
    // אם יש הפרש — כדי שבדיקה 3 תשתמש
    // בערך הנכון
    const chargeableWeightResult = chargeableWeightValidator.validate(shipment);
    // בדיקה 3 — אימות תעריף בסיס
    // משתמשת ב-shipment.chargeableWeight
    // המעודכן מבדיקה 2
    const baseRateResult = baseRateValidator.validate(shipment, direction);
    // בדיקה 4 — אימות תוספת משקל AHS
    const ahsWeightResult = ahsWeightValidator.validate(shipment);

    // בדיקה 5 — אימות חומרים מסוכנים DG
    const dangerousGoodsResult = dangerousGoodsValidator.validate(shipment);

    // חישוב סטטוס כולל למשלוח
    // אם אפילו בדיקה אחת נכשלה → failed
    // אם הכל תקין → passed
    const allResults = [
      zoneResult,
      chargeableWeightResult,
      baseRateResult,
      ahsWeightResult,
      dangerousGoodsResult,
    ];

    const overallStatus = allResults.some(r => r.status !== 'passed')
      ? 'failed'
      : 'passed';

    // מחזיר את המשלוח המלא עם תוצאות כל הבדיקות
    return {
      ...shipment,
      validations: {
        zone:             zoneResult,
        chargeableWeight: chargeableWeightResult,
        baseRate:         baseRateResult,
        ahsWeight:        ahsWeightResult,
        dangerousGoods:   dangerousGoodsResult,
      },
      overallStatus,
    };
  });

  // חישוב סיכום כספי לחשבונית כולה
  const summary = calculateSummary(validatedShipments);
  // ש — בניית מסמך לשמירה ב-DB
  const invoiceData = {
    invoiceNumber: extractedData.invoiceNumber,
    invoiceDate:   extractedData.invoiceDate,
    filePath,
    direction,
    shipments:     validatedShipments,
    summary,
  };
  //  שמירה ב-MongoDB
  const invoice = new Invoice(invoiceData);
  await invoice.save();

  return invoice;
};

// פונקציה עזר — חישוב סיכום כספי
// מחשבת סך חויב, סך צפוי, והפרש כולל
const calculateSummary = (shipments) => {

  let totalChargedUSD  = 0;
  let totalExpectedUSD = 0;
  let totalChargedILS  = 0;
  let totalExpectedILS = 0;

  for (const shipment of shipments) {

    const { validations } = shipment;

    // סיכום USD — תעריף בסיס
    if (validations.baseRate) {
      totalChargedUSD  += validations.baseRate.charged  || 0;
      totalExpectedUSD += validations.baseRate.expected || 0;
    }

    // סיכום ILS — AHS + DG
    if (validations.ahsWeight) {
      totalChargedILS  += validations.ahsWeight.chargedAHS  || 0;
      totalExpectedILS += validations.ahsWeight.expectedAHS || 0;
    }

    if (validations.dangerousGoods) {
      totalChargedILS  += validations.dangerousGoods.chargedDG  || 0;
      totalExpectedILS += validations.dangerousGoods.expectedDG || 0;
    }
  }

  // חישוב הפרשים — עד 2 ספרות
  const diffUSD = parseFloat((totalChargedUSD - totalExpectedUSD).toFixed(2));
  const diffILS = parseFloat((totalChargedILS - totalExpectedILS).toFixed(2));

  // סטטוס כולל לחשבונית
  const status = shipments.every(s => s.overallStatus === 'passed')
    ? 'passed'
    : 'discrepancy';

  return {
    totalChargedUSD:  parseFloat(totalChargedUSD.toFixed(2)),
    totalExpectedUSD: parseFloat(totalExpectedUSD.toFixed(2)),
    diffUSD,
    totalChargedILS:  parseFloat(totalChargedILS.toFixed(2)),
    totalExpectedILS: parseFloat(totalExpectedILS.toFixed(2)),
    diffILS,
    status,
  };
};

module.exports = validateInvoice;