class AHSWeightValidator {

  static AHS_MIN_WEIGHT = 25;    // ק"ג — סף תחתון
  static AHS_MAX_WEIGHT = 68;    // ק"ג — סף עליון
  static AHS_CHARGE     = 140;   // ILS — תעריף קבוע

  validate(shipment) {

    // המשקל הפיזי שכתוב בחשבונית
   const actualWeight = shipment.actualWeight;

    // חיוב AHS שכתוב בחשבונית (אם קיים)
   const ahsSurcharge = shipment.surcharges?.find(
   s => (s.type?.toLowerCase().includes('ahs') &&
        s.type?.toLowerCase().includes('weight')) ||
       (s.type?.toLowerCase().includes('additional handling') &&
        s.type?.toLowerCase().includes('weight'))
   );

    const chargedAHS = ahsSurcharge ? ahsSurcharge.amount : 0;

    //   מעל 68 ק"ג
    if (actualWeight > AHSWeightValidator.AHS_MAX_WEIGHT) {
      return {
        status: 'passed',
        actualWeight,
        chargedAHS,
        expectedAHS: 0,
        currency: 'ILS',
        message: `משקל ${actualWeight} ק"ג — AHS לא חל, שירות Freight בלבד`
      };
    }

    //מתחת ל-25 ק"ג - לא אמור להיות חיוב
    if (actualWeight < AHSWeightValidator.AHS_MIN_WEIGHT) {

      // יש חיוב למרות שלא אמור להיות — שגיאה
      if (chargedAHS > 0) {
        return {
          status: 'discrepancy',
          actualWeight,
          chargedAHS,
          expectedAHS: 0,
          currency: 'ILS',
          message:
            `שגיאה Weight-AHS חוייב על משקל ${actualWeight} ק"ג — ` +
            `מתחת לסף ${AHSWeightValidator.AHS_MIN_WEIGHT} ק"ג | ` +
            `זיכוי: ${AHSWeightValidator.AHS_CHARGE} ILS`
        };
      }

      // אין חיוב — תקין
      return {
        status: 'passed',
        actualWeight,
        chargedAHS: 0,
        expectedAHS: 0,
        currency: 'ILS',
        message: ''
      };
    }

    // אין חיוב למרות שאמור להיות — שגיאה
    if (chargedAHS === 0) {
      return {
        status: 'discrepancy',
        actualWeight,
        chargedAHS: 0,
        expectedAHS: AHSWeightValidator.AHS_CHARGE,
        currency: 'ILS',
        message:
          `שגיאה Weight-AHS חסר — משקל ${actualWeight} ק"ג עובר סף ` +
          `${AHSWeightValidator.AHS_MIN_WEIGHT} ק"ג | ` +
          `חיוב חסר: ${AHSWeightValidator.AHS_CHARGE} ILS`
      };
    }

    // יש חיוב אבל הסכום שגוי
    if (chargedAHS !== AHSWeightValidator.AHS_CHARGE) {
      return {
        status: 'discrepancy',
        actualWeight,
        chargedAHS,
        expectedAHS: AHSWeightValidator.AHS_CHARGE,
        currency: 'ILS',
        message:
          `שגיאה Weight-AHS סכום שגוי — חוייב: ${chargedAHS} ILS | ` +
          `צפוי: ${AHSWeightValidator.AHS_CHARGE} ILS`
      };
    }

    // הכל תקין
    return {
      status: 'passed',
      actualWeight,
      chargedAHS,
      expectedAHS: AHSWeightValidator.AHS_CHARGE,
      currency: 'ILS',
      message: ''
    };
  }
}
module.exports = new AHSWeightValidator();