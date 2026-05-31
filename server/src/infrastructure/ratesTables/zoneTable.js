const ZONE_TABLE_EXPORT = {
  // ===== אירופה (A-Z) =====
  Albania: 'W', Andorra: 'T', Austria: 'T', Belgium: 'R', 'Bosnia-Herzegovina': 'W', 
  Bulgaria: 'V', Croatia: 'W', Cyprus: 'W', 'Czech Republic': 'V', Denmark: 'U', 
  Estonia: 'V', Finland: 'U', France: 'S', Germany: 'R', Gibraltar: 'T', 
  Greece: 'T', Hungary: 'V', Iceland: 'W', Ireland: 'T', Italy: 'S', 
  Latvia: 'V', Liechtenstein: 'U', Lithuania: 'V', Luxembourg: 'R', Malta: 'W', 
  Moldova: 'W', Monaco: 'T', Montenegro: 'W', Netherlands: 'R', 'North Macedonia': 'W', 
  Norway: 'U', Poland: 'V', Portugal: 'T', Romania: 'V', Serbia: 'W', 
  Slovakia: 'V', 'Slovak Republic': 'V', Slovenia: 'V', Spain: 'S', Sweden: 'U', 
  Switzerland: 'U', Turkey: 'W', UK: 'X', Ukraine: 'W', 'United Kingdom': 'X',

  // ===== עולם (A-Z) =====
  'American Samoa': 'E', Angola: 'E', Anguilla: 'D', 'Antigua & Barbuda': 'D', Argentina: 'D', 
  Armenia: 'C', Aruba: 'D', Australia: 'G', Azerbaijan: 'C', Bahamas: 'D', 
  Bahrain: 'C', Barbados: 'D', Belize: 'D', Benin: 'E', Bermuda: 'D', 
  Bhutan: 'C', Bolivia: 'D', Brazil: 'D', Brunei: 'C', Cambodia: 'B', 
  Cameroon: 'E', Canada: 'A', 'Cape Verde': 'E', 'Cayman Islands': 'D', Chad: 'E', 
  Chile: 'D', China: 'F', Colombia: 'D', 'Cook Islands': 'E', 'Costa Rica': 'D', 
  Curacao: 'D', Djibouti: 'E', Dominica: 'D', 'Dominican Republic': 'D', 'East Timor': 'B', 
  Ecuador: 'D', Egypt: 'C', 'El Salvador': 'D', Eritrea: 'E', Eswatini: 'E', 
  Ethiopia: 'E', Fiji: 'E', 'French Guiana': 'D', 'French Polynesia': 'E', Gabon: 'E', 
  Gambia: 'E', Georgia: 'C', Ghana: 'E', Grenada: 'D', Guadeloupe: 'D', 
  Guam: 'E', Guatemala: 'D', Guinea: 'E', Guyana: 'D', Haiti: 'D', 
  Honduras: 'D', 'Hong Kong': 'F', 'Hong Kong SAR': 'F', 'Hong Kong SAR, China': 'F', India: 'C', 
  Indonesia: 'B', 'Ivory Coast': 'E', Jamaica: 'D', Japan: 'I', Jordan: 'C', 
  Kazakhstan: 'E', Kenya: 'E', 'Korea, South': 'B', Kyrgyzstan: 'E', Laos: 'B', 
  Lesotho: 'E', Liberia: 'E', 'Macao SAR, China': 'B', Madagascar: 'E', Malawi: 'E', 
  Malaysia: 'B', Maldives: 'E', Mali: 'E', 'Marshall Islands': 'E', Martinique: 'D', 
  Mauritania: 'E', Mauritius: 'E', Mexico: 'D', Micronesia: 'E', Montserrat: 'D', 
  Morocco: 'C', Namibia: 'E', Nepal: 'C', 'New Caledonia': 'E', 'New Zealand': 'G', 
  Nicaragua: 'D', Niger: 'E', Nigeria: 'E', Oman: 'C', Pakistan: 'C', 
  'Palestinian Authority': 'C', Panama: 'D', 'Papua New Guinea': 'E', Paraguay: 'D', Peru: 'D', 
  Philippines: 'B', 'Puerto Rico': 'D', Qatar: 'C', Rwanda: 'E', Saipan: 'E', 
  'Samoa, West': 'E', Senegal: 'E', Seychelles: 'E', Singapore: 'I', 'South Africa': 'D', 
  'South Korea': 'B', 'Sri Lanka': 'C', 'St. Kitts & Nevis': 'D', 'St. Lucia': 'D', 'St. Maarten (NL)': 'D', 
  'St. Martin (FR)': 'D', 'St. Vincent': 'D', Suriname: 'D', Taiwan: 'B', 'Taiwan, China': 'B', 
  Tanzania: 'E', Thailand: 'B', Togo: 'E', Tonga: 'E', 'Trinidad & Tobago': 'D', 
  UAE: 'C', Uganda: 'E', 'United Arab Emirates': 'C', 'United States': 'H', Uruguay: 'D', 
  USA: 'H', Uzbekistan: 'E', Vanuatu: 'E', Vietnam: 'B', 'Virgin Islands (GB)': 'D', 
  'Virgin Islands (USA)': 'D', 'Wallis & Futuna': 'E', Zambia: 'E', Zimbabwe: 'E'
};

const ZONE_TABLE_IMPORT = {
  // ===== אירופה (A-Z) =====
  Albania: 'W', Andorra: 'T', Austria: 'T', Belgium: 'R', 'Bosnia-Herzegovina': 'W', 
  Bulgaria: 'V', Croatia: 'W', Cyprus: 'W', 'Czech Republic': 'V', Denmark: 'U', 
  Estonia: 'V', 'Faroe Islands': 'E', Finland: 'U', France: 'S', Germany: 'R', 
  Gibraltar: 'T', Greece: 'T', Greenland: 'E', Hungary: 'V', Iceland: 'W', 
  Ireland: 'T', Italy: 'S', Latvia: 'V', Liechtenstein: 'U', Lithuania: 'V', 
  Luxembourg: 'R', Malta: 'W', Moldova: 'W', Monaco: 'T', Montenegro: 'W', 
  Netherlands: 'R', 'North Macedonia': 'W', Norway: 'U', Poland: 'V', Portugal: 'T', 
  Romania: 'V', Serbia: 'W', Slovakia: 'V', 'Slovak Republic': 'V', Slovenia: 'V', 
  Spain: 'S', Sweden: 'U', Switzerland: 'U', Turkey: 'W', UK: 'X', 
  Ukraine: 'W', 'United Kingdom': 'X',

  // ===== עולם (A-Z) =====
  Algeria: 'C', Angola: 'E', Anguilla: 'D', 'Antigua & Barbuda': 'D', Argentina: 'D', 
  Armenia: 'C', Aruba: 'D', Australia: 'G', Azerbaijan: 'C', Bahamas: 'D', 
  Bahrain: 'C', Barbados: 'D', Belize: 'D', Benin: 'E', Bermuda: 'D', 
  Bhutan: 'C', Bolivia: 'D', 'Bonaire, Saba, St. Eustatius': 'D', Botswana: 'E', Brazil: 'D', 
  'Burkina Faso': 'E', Burundi: 'E', Cambodia: 'B', Cameroon: 'E', Canada: 'A', 
  'Cape Verde': 'E', 'Cayman Islands': 'D', Chad: 'E', Chile: 'D', China: 'F', 
  Colombia: 'D', 'Costa Rica': 'D', Curacao: 'D', Djibouti: 'E', Dominica: 'D', 
  'Dominican Republic': 'D', 'East Timor': 'B', Ecuador: 'D', Egypt: 'C', 'El Salvador': 'D', 
  Eritrea: 'E', 'Eswatini (Swaziland)': 'E', Ethiopia: 'E', Fiji: 'E', 'French Guiana': 'D', 
  Gabon: 'E', Gambia: 'E', Georgia: 'C', Ghana: 'E', Grenada: 'D', 
  Guadeloupe: 'D', Guam: 'E', Guatemala: 'D', Guinea: 'E', Guyana: 'D', 
  Haiti: 'D', Honduras: 'D', 'Hong Kong': 'F', 'Hong Kong SAR, China': 'F', India: 'C', 
  Indonesia: 'B', 'Ivory Coast': 'E', Jamaica: 'D', Japan: 'I', Jordan: 'C', 
  Kazakhstan: 'E', Kenya: 'E', 'Korea, South': 'B', Kyrgyzstan: 'E', Laos: 'B', 
  Lesotho: 'E', Liberia: 'E', 'Macao SAR, China': 'B', Malawi: 'E', Malaysia: 'B', 
  Maldives: 'E', Mali: 'E', 'Marshall Islands': 'E', Martinique: 'D', Mauritania: 'E', 
  Mauritius: 'E', Mexico: 'D', Micronesia: 'E', Mongolia: 'E', Montserrat: 'D', 
  Morocco: 'C', Mozambique: 'E', Namibia: 'E', Nepal: 'C', 'New Caledonia': 'E', 
  'New Zealand': 'G', Nicaragua: 'D', Nigeria: 'E', Palau: 'E', 'Palestinian Authority': 'C', 
  Panama: 'D', 'Papua New Guinea': 'E', Paraguay: 'D', Peru: 'D', Philippines: 'B', 
  'Reunion Island': 'E', Rwanda: 'E', Saipan: 'E', 'Samoa, West': 'E', Senegal: 'E', 
  Seychelles: 'E', Singapore: 'I', 'South Africa': 'D', 'South Korea': 'B', 'Sri Lanka': 'C', 
  'St. Kitts & Nevis': 'D', 'St. Lucia': 'D', 'St. Maarten (NL)': 'D', 'St. Martin (FR)': 'D', 'St. Vincent': 'D', 
  Suriname: 'D', Taiwan: 'B', 'Taiwan, China': 'B', Tanzania: 'E', Thailand: 'B', 
  Togo: 'E', Tonga: 'E', 'Trinidad & Tobago': 'D', 'Turks & Caicos Islands': 'D', UAE: 'C', 
  Uganda: 'E', 'United Arab Emirates': 'C', 'United States': 'H', Uruguay: 'D', USA: 'H', 
  Uzbekistan: 'E', Vietnam: 'B', 'Virgin Islands (GB)': 'D', 'Virgin Islands (USA)': 'D', Zambia: 'E', 
  Zimbabwe: 'E'
};

const getZone = (country, direction) => {
  if (direction !== 'export' && direction !== 'import') {
    return null;
  }
  const table = direction === 'export' ? ZONE_TABLE_EXPORT : ZONE_TABLE_IMPORT;
    console.log(`הזון שיצא מהטייבל הוא: ${table[country]}`);    
    return table[country] || null;
};


module.exports = {
  ZONE_TABLE_EXPORT,
  ZONE_TABLE_IMPORT,
  getZone,
};
