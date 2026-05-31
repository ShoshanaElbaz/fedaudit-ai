const mongoose = require('mongoose');

const ValidationResultSchema = new mongoose.Schema({

  // סטטוס הבדיקה — חייב להיות אחד מ-3 הערכים האלה בלבד
  status: {
    type: String,
    enum: ['passed', 'discrepancy', 'error'],
    required: true
  },

  // כמה חויב בפועל בחשבונית
  charged:  Number,
  // כמה היה צריך לחייב לפי הטבלאות שלנו
  expected: Number,
  // ההפרש בין charged ל-expected
  diff:     Number,
  // מטבע החיוב — USD או ILS
  currency: String,
  // הסבר קצר על הבדיקה בעברית למשתמש
  message:  String,

  // שדות ייחודיים לבדיקה 1 — Zone Validation
  // ה-Zone שכתוב בחשבונית
  invoiceZone:  String,
  // ה-Zone הנכון לפי טבלת FedEx 
  expectedZone: String,

  // שדה ייחודי לבדיקה 4 — AHS Weight
  // המשקל הפיזי של החבילה בק"ג
  actualWeight: Number,

  // שדות ייחודיים לבדיקה 5 — Dangerous Goods
  // סוג החומר המסוכן: ADG / IDG / Dry Ice
  dgType:          String,
  // השירות שבו נעשה שימוש: IP / IPE / IE וכו'
  service:         String,

}, { _id: false });


// ===== Schema לתוספת חיוב =====
// מייצג תוספת אחת כמו: Fuel Surcharge, AHS, ADG
const SurchargeSchema = new mongoose.Schema({

  // שם התוספת — לדוגמה: "AHS-Weight", "Fuel", "ADG"
  type:     { type: String, required: true },
  // סכום התוספת במספר
  amount:   { type: Number, required: true },
  // מטבע התוספת — רק USD או ILS מותרים
  currency: { type: String, enum: ['USD', 'ILS'] }

}, { _id: false });

// מייצג משלוח אחד בתוך החשבונית
const ShipmentSchema = new mongoose.Schema({

  // מספר המעקב הייחודי של המשלוח — חובה
  trackingNumber:   { type: String, required: true },
  // סוג השירות: IP, IPE, IE, FIF, FICP וכו' — חובה
  service:          { type: String, required: true },
  // מדינת היעד באנגלית: Germany, Netherlands וכו' — חובה
  destination:      { type: String, required: true },
  // אזור התעריף: R, S, T, U, V, W, X — משמש בדיקה 1 + בדיקה 3
  zone:             { type: String },
  // המשקל הפיזי האמיתי של החבילה בק"ג
  actualWeight:     { type: Number },

  // מידות החבילה בס"מ — משמשות לחישוב משקל נפחי בבדיקה 2
  dimensions: {
    l: Number,
    w: Number,
    h: Number
  },

  // משקל לחיוב = MAX(משקל פיזי, משקל נפחי) — משמש בדיקה 2 + בדיקה 3
  chargeableWeight: { type: Number },
  // סוג האריזה: Other packaging / FedEx Pak / FedEx Envelope וכו'
  packaging:        { type: String },
  // תעריף הבסיס שחויב בחשבונית ב-USD — משמש בדיקה 3
  baseRate:         { type: Number },
  // מערך של כל התוספות: Fuel, AHS, ADG וכו' — משמש בדיקה 4 + 5
  surcharges:       [SurchargeSchema],

  // תוצאות כל 5 הבדיקות למשלוח זה
  validations: {
    zone:             ValidationResultSchema,
    chargeableWeight: ValidationResultSchema,
    baseRate:         ValidationResultSchema,
    ahsWeight:        ValidationResultSchema,
    dangerousGoods:   ValidationResultSchema
  },

  overallStatus: {
    type: String,
    enum: ['passed', 'failed'],
    default: 'passed'
  }

}, { _id: false });


// זה ה-document הראשי שנשמר ב-MongoDB
const InvoiceSchema = new mongoose.Schema({

  invoiceNumber: { type: String, required: true },
  invoiceDate:   { type: String },
  filePath:      { type: String, required: true },

  direction: {
    type: String,
    enum: ['export', 'import'],
    required: true
  },

  // מערך של כל המשלוחים בחשבונית
  shipments: [ShipmentSchema],

  // סיכום כספי של כל החשבונית
  summary: {
    totalChargedUSD:  { type: Number, default: 0 },
    totalExpectedUSD: { type: Number, default: 0 },
    diffUSD:          { type: Number, default: 0 },
    totalChargedILS:  { type: Number, default: 0 },
    totalExpectedILS: { type: Number, default: 0 },
    diffILS:          { type: Number, default: 0 },
    // סטטוס כללי של החשבונית
    status: {
      type: String,
      enum: ['passed', 'discrepancy', 'error'],
      default: 'passed'
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', InvoiceSchema);






    





