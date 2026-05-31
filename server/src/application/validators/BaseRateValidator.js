const { EXPORT_RATES } = require('../../infrastructure/ratesTables/exportRates');
const { IMPORT_RATES } = require('../../infrastructure/ratesTables/importRates');

class BaseRateValidator {

  // מיפוי סוג אריזה למפתח בטבלה
  getPackagingKey(packaging) {

    if (!packaging) return 'other';
    const text = packaging.toLowerCase();
    if (text.includes('envelope')) return 'envelope';
    if (text.includes('pak')) return 'pak';
    if (text.includes('10kg')) return 'box10kg';
    if (text.includes('25kg')) return 'box25kg';
    return 'other';
  }

  //   חישוב מחיר לפי משקל לסוג אריזה -OTHER
  getRateByWeight(zoneRates, weight) {

    if (weight <= 10) {
      const rounded = Math.ceil(weight * 2) / 2;
      if (rounded === 10) return zoneRates.base10; 
      return zoneRates[rounded];
    }

    if (weight <= 21) {
      if (weight === 21) return zoneRates.base21; 
      const units = Math.ceil((weight - 10) / 0.5);
      return parseFloat(
        (zoneRates.base10 + (units * zoneRates.addPer0_5_to10)).toFixed(2)
      );
    }

    if (weight <= 30) {
      if (weight === 30) return zoneRates.base30; 
      const units = Math.ceil((weight - 21) / 0.5);
      return parseFloat(
        (zoneRates.base21 + (units * zoneRates.addPer0_5_to21)).toFixed(2)
      );
    }

    if (weight <= 45) {
      if (weight === 45) return zoneRates.base45; 
      const units = Math.ceil((weight - 30) / 0.5);
      return parseFloat(
        (zoneRates.base30 + (units * zoneRates.addPer0_5_to30)).toFixed(2)
      );
    }

    if (weight <= 70.5) {
      if (weight === 70.5) return zoneRates.base70_5;
      const units = Math.ceil((weight - 45) / 0.5);
      return parseFloat(
        (zoneRates.base45 + (units * zoneRates.addPer0_5_to45)).toFixed(2)
      );
    }

    if (weight <= 99) {
      return parseFloat((weight * zoneRates.perKg_71_99).toFixed(2));
    }

    if (weight <= 299) {
      return parseFloat((weight * zoneRates.perKg_100_299).toFixed(2));
    }

    if (weight <= 499) {
      return parseFloat((weight * zoneRates.perKg_300_499).toFixed(2));
    }

    if (weight <= 999) {
      return parseFloat((weight * zoneRates.perKg_500_999).toFixed(2));
    }

    return parseFloat((weight * zoneRates.perKg_1000plus).toFixed(2));
  }

  //פונקציה לחישוב מחיר של משקל לפי סוג חבילה
  getRateByPackaging(rates, packaging, zone, weight) {

    const packagingKey = this.getPackagingKey(packaging);
    const serviceRates = rates[packagingKey];

    if (!serviceRates || !serviceRates[zone]) {
      return null;
    }
    const zoneRates = serviceRates[zone];
    // envelope — תמיד 0.5 ק"ג
    if (packagingKey === 'envelope') {
      return zoneRates[0.5] || null;
    }

    // pak — טבלה קטנה עד 2.5 ק"ג
    if (packagingKey === 'pak') {
      const rounded = Math.ceil(weight * 2) / 2;
      return zoneRates[rounded] || null;
    }

    // box10kg — בסיס + תוספת לק"ג מעל 10
    if (packagingKey === 'box10kg') {
      if (weight <= 10) return zoneRates.base;
      return parseFloat(
        (zoneRates.base + ((weight - 10) * zoneRates.addPerKg)).toFixed(2)
      );
    }

    // box25kg — בסיס + תוספת לק"ג מעל 25
    if (packagingKey === 'box25kg') {
      if (weight <= 25) return zoneRates.base;
      return parseFloat(
        (zoneRates.base + ((weight - 25) * zoneRates.addPerKg)).toFixed(2)
      );
    }

    // other packaging 
    return this.getRateByWeight(zoneRates, weight);
  }


  validate(shipment, direction) {

    const { service, packaging, baseRate } = shipment;
    const zone = shipment.zone ? shipment.zone.replace(/^Zone\s*/i, '') : null;
    const verifiedWeight = shipment.chargeableWeight;
    const rates = direction === 'export' ? EXPORT_RATES : IMPORT_RATES;

    // בודק שהשירות קיים בטבלה
    if (!rates[service]) {
      return {
        status: 'error',
        charged: baseRate,
        expected: null,
        diff: null,
        message: `שירות "${service}" אינו נתמך במערכת — יש לבדוק ידנית `
      };
    }

    // מחשב תעריף צפוי
    const expectedRate = this.getRateByPackaging(
      rates[service],
      packaging,
      zone,
      verifiedWeight
    );

    // לא נמצא תעריף
    if (expectedRate === null) {
      return {
        status: 'error',
        charged: baseRate,
        expected: null,
        diff: null,
        message: `לא נמצא תעריף עבור שירות ${service} | Zone ${zone} | אריזה: ${packaging} | משקל: ${verifiedWeight} ק"ג — יש לבדוק ידנית`
      };
    }

    // חישוב הפרש — עד 2 ספרות אחרי הנקודה
    const diff = parseFloat((baseRate - expectedRate).toFixed(2));

    // יש הפרש
    if (diff !== 0) {
      return {
        status: 'discrepancy',
        charged: baseRate,
        expected: expectedRate,
        diff,
        message:
          `שגיאה חוייב: ${baseRate} USD | ` +
          `צפוי: ${expectedRate} USD | ` +
          `הפרש: ${diff} USD`
      };
    }

    // הכל תקין
    return {
      status: 'passed',
      charged: baseRate,
      expected: expectedRate,
      diff: 0,
      message: ''
    };
  }
}

module.exports = new BaseRateValidator();