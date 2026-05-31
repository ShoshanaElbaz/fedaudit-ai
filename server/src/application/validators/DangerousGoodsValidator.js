class DangerousGoodsValidator {

  static DG_RULES = {
    'ADG': {
      expectedAmount:  328,
      allowedServices: ['IP', 'IPE', 'FIF'],
      fullName:        'ADG נגיש',
    },
    'IDG': {
      expectedAmount:  239,
      allowedServices: ['IP', 'IPE', 'FIF', 'FICP'],
      fullName:        'IDG לא נגיש',
    },
    'DRY ICE': {
      expectedAmount:  48,
      allowedServices: ['IP', 'IPE'],
      fullName:        'Dry Ice',
    },
  };

  detectDGType(surchargeType) {

    const type = (surchargeType || '').toLowerCase();
    
    if (type.includes('dry ice') ||
        type.includes('dry_ice') ||
        type.includes('dryice')) {
      return 'DRY ICE';
    }

    
   if (type.includes('idg') || 
      type.includes('inaccessible')) {
      return 'IDG';
   }
  
   if (type.includes('adg') || 
    type.includes('accessible')) {
    return 'ADG';
   }


    return null;
  }

validate(shipment) {
  const serviceName = (shipment.service || '').toUpperCase();
  const surcharges = shipment.surcharges || [];
  const errors = [];
  const foundDgTypes = [];

  // ← מצבר סכומים לסיכום
  let totalCharged  = 0;
  let totalExpected = 0;

  for (const surcharge of surcharges) {
    const dgKey = this.detectDGType(surcharge.type);
    if (!dgKey) continue;

    foundDgTypes.push(dgKey);
    const rule = DangerousGoodsValidator.DG_RULES[dgKey];
    const actualAmount = Number(surcharge.amount || 0);
    totalCharged  += actualAmount;
    totalExpected += rule.expectedAmount;

    // בדיקת שירות
    if (!rule.allowedServices.includes(serviceName)) {
      errors.push(
        `שגיאה שירות [${shipment.service}] אינו מורשה ` +
        `לסוג [${dgKey}]: DG | ` +
        `שירותים מותרים: [${rule.allowedServices.join(', ')}]`
      );
    }

    // בדיקת סכום
    const diff = parseFloat(
      (actualAmount - rule.expectedAmount).toFixed(2)
    );
    if (diff !== 0) {
      errors.push(
        `שגיאה סכום שגוי ${dgKey} — ` +
        `חוייב: ${actualAmount} ILS | ` +
        `צפוי: ${rule.expectedAmount} ILS | ` +
        `הפרש: ${Math.abs(diff)} ILS`
      );
    }
  }

  // יש שגיאות
  if (errors.length > 0) {
    return {
      status:    'discrepancy',
      dgTypes:   foundDgTypes,
      chargedDG:  parseFloat(totalCharged.toFixed(2)),
      expectedDG: parseFloat(totalExpected.toFixed(2)),
      currency:  'ILS',
      message:   errors.join(' | ')
    };
  }

  // הכל תקין
  return {
    status:    'passed',
    dgTypes:   foundDgTypes,
    chargedDG:  parseFloat(totalCharged.toFixed(2)),   // ← הוסף
    expectedDG: parseFloat(totalExpected.toFixed(2)),  // ← הוסף
    currency:  'ILS',
    message:   ''
  };
}
}
module.exports = new DangerousGoodsValidator();