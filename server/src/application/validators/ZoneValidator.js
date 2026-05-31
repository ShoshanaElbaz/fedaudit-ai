const { getZone } = require('../../infrastructure/ratesTables/zoneTable');

class ZoneValidator {

  validate(shipment, direction) {

    // מדינת היעד שGemini חילץ
    const destination = shipment.destination;

    const invoiceZone = (shipment.zone || '')
     .replace(/zone\s*/i, '')
     .trim()
     .toUpperCase();
     shipment.zone = invoiceZone;

    // משתמשים בפונקציה שבודקת אוטומטית לפי כיוון המשלוח והמדינה
    const expectedZone = getZone(destination, direction);

    //  המדינה לא קיימת בטבלאות
    if (!expectedZone) {
      return {
        status: 'error',
        invoiceZone,
        message: "המדינה לא נמצאה"	     
       };	    
      }		   

    if (!invoiceZone) {
      return {
        status: 'passed',
        invoiceZone: null,
        expectedZone,
        message: `Zone לא סופק בחשבונית | Zone צפוי לפי טבלה: ${expectedZone}`
      };
    }


    if (invoiceZone !== expectedZone) {
      return {
        status: 'discrepancy',
        invoiceZone,
        expectedZone,
        message: `Zone בחשבונית: ${invoiceZone} | Zone נכון לפי טבלה: ${expectedZone}`
      };
    }


    return {
      status: 'passed',
      invoiceZone,
      expectedZone,
      message: ''
    };
  }
}

module.exports = new ZoneValidator();



