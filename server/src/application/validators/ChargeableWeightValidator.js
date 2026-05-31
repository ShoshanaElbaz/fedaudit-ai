class ChargeableWeightValidator {

  //עיגול כלפי מעלה
  roundToHalfKg(weight) {
    return Math.ceil(weight * 2) / 2;
  }

  calculateDimWeight(dimensions) {

    if (!dimensions || !dimensions.l || !dimensions.w || !dimensions.h) {
      return null;
    }
    // נוסחת FedEx: L × W × H ÷ 5,000
    const rawDimWeight = (dimensions.l * dimensions.w * dimensions.h) / 5000;
    return this.roundToHalfKg(rawDimWeight);
  }

  validate(shipment) {

    const actualWeight = shipment.actualWeight;
    // המשקל לחיוב שכתוב בחשבונית
    const chargeableWeightInInvoice = shipment.chargeableWeight;
    // מידות החבילה בס"מ
    const dimensions = shipment.dimensions;
    const dimWeight = this.calculateDimWeight(dimensions);

    //אין מידות
    if (dimWeight === null) {
      return {
        status: 'passed',
        charged: chargeableWeightInInvoice,
        expected: actualWeight,
        diff: 0,
        message: 'מידות לא סופקו — לא ניתן לאמת משקל נפחי'
      };
    }

    // MAX(משקל פיזי,משקל לחיוב, משקל נפחי)
    const expectedChargeableWeight = Math.max(
    actualWeight,
    dimWeight,
    chargeableWeightInInvoice
    );

    //חישוב הפרש עם עשרוני
    const diff = parseFloat(
      (chargeableWeightInInvoice - expectedChargeableWeight).toFixed(2)
    );

   //יש הפרש במשקל
    if (diff !== 0) {
        shipment.chargeableWeight = expectedChargeableWeight;
        return {
        status: 'discrepancy',
        charged: chargeableWeightInInvoice,
        expected: expectedChargeableWeight,
        diff,
        dimWeight,
        message: 
          `חוייב: ${chargeableWeightInInvoice} ק"ג | ` +
          `צפוי: ${expectedChargeableWeight} ק"ג | ` +
          `הפרש: ${diff} ק"ג | ` +
          `משקל נפחי: ${dimensions.l}×${dimensions.w}×${dimensions.h}÷5000 = ${dimWeight} ק"ג | ` +
          `MAX(${actualWeight}, ${dimWeight},${chargeableWeightInInvoice}) = ${expectedChargeableWeight} ק"ג`
      };
    }

    //הכל תקין 
    return {
      
      status: 'passed',
      charged: chargeableWeightInInvoice,
      expected: expectedChargeableWeight,
      diff: 0,
      dimWeight,
      message: ''
    };
  }
}
module.exports = new ChargeableWeightValidator();
