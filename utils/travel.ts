export const CITY_TO_IATA: Record<string, string> = {
  abuja: "ABV",
  lagos: "LOS",
  dubai: "DXB",
  london: "LHR",
  tokyo: "TYO",
  paris: "CDG",
  "new york": "JFK",
  singapore: "SIN",
  istanbul: "IST",
  amsterdam: "AMS",
  frankfurt: "FRA",
  nairobi: "NBO",
  accra: "ACC",
  cairo: "CAI",
  johannesburg: "JNB",
  toronto: "YYZ",
  "los angeles": "LAX",
  chicago: "ORD",
  miami: "MIA",
  sydney: "SYD",
  mumbai: "BOM",
  delhi: "DEL",
  bangkok: "BKK",
  "kuala lumpur": "KUL",
  doha: "DOH",
  riyadh: "RUH",
  casablanca: "CMN",
  "addis ababa": "ADD",
  "dar es salaam": "DAR",
  kigali: "KGL",
  rome: "FCO",
  madrid: "MAD",
  barcelona: "BCN",
  beijing: "PEK",
  shanghai: "PVG",
  "hong kong": "HKG",
  santorini: "JTR",
  mykonos: "JMK",
  cancun: "CUN",
  cancún: "CUN",
  seychelles: "SEZ",
  maldives: "MLE",
  bali: "DPS",
  phuket: "HKT",
  zanzibar: "ZNZ",
  "cape town": "CPT",
  marrakech: "RAK",
  lisbon: "LIS",
  athens: "ATH",
  milan: "MXP",
  zurich: "ZRH",
  vienna: "VIE",
  prague: "PRG",
  budapest: "BUD",
  brussels: "BRU",
  copenhagen: "CPH",
  oslo: "OSL",
  stockholm: "ARN",
  reykjavik: "KEF",
  "mexico city": "MEX",
  bogota: "BOG",
  lima: "LIM",
  "rio de janeiro": "GIG",
  "buenos aires": "EZE",
  cappadocia: "ASR",
  mauritius: "MRU",
  hawaii: "HNL",
  nice: "NCE",
  florence: "FLR",
  venice: "VCE",
  dubrovnik: "DBV",
  colombo: "CMB",
  kathmandu: "KTM",
  "ho chi minh": "SGN",
  hanoi: "HAN",
  "chiang mai": "CNX",
  taipei: "TPE",
  seoul: "ICN",
  osaka: "KIX",
};

export const AIRPORT_TO_HOTEL_CITY: Record<string, string> = {
  JFK: "NYC",
  LHR: "LON",
  LAX: "LAX",
  CDG: "PAR",
  NRT: "TYO",
  DXB: "DXB",
  SIN: "SIN",
  LOS: "LOS",
  ABV: "ABJ",
  ACC: "ACC",
  NBO: "NBO",
  JNB: "JNB",
  CAI: "CAI",
  CMN: "CAS",
  ADD: "ADD",
  IST: "IST",
  AMS: "AMS",
  FRA: "FRA",
  FCO: "ROM",
  MAD: "MAD",
  YYZ: "YTO",
  ORD: "CHI",
  MIA: "MIA",
  SYD: "SYD",
  BOM: "BOM",
  DEL: "DEL",
  BKK: "BKK",
  KUL: "KUL",
  DOH: "DOH",
  RUH: "RUH",
};

export function cityNameToIata(cityName: string | undefined): string | null {
  if (!cityName) return null;
  const key = cityName.toLowerCase().trim();
  if (CITY_TO_IATA[key]) return CITY_TO_IATA[key];
  const match = Object.keys(CITY_TO_IATA).find((k) =>
    k.includes(key.split(" ")[0]),
  );
  return match ? CITY_TO_IATA[match] : null;
}

export function getCheckOutDate(checkIn: string, nights = 3): string {
  const date = new Date(checkIn);
  date.setDate(date.getDate() + nights);
  return date.toISOString().split("T")[0];
}

export function getDefaultDepartureDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
}

// Extracts a city name from natural language
// "I want to go to Santorini" → "Santorini"
// "Take me to Bali" → "Bali"
// "Let's do Cape Town" → "Cape Town"

export function extractCityFromMessage(message: string): string | null {
  const patterns = [
    /(?:go to|travel to|visit|take me to|heading to|fly to|trip to|do|thinking)\s+([A-Z][a-zA-Z\s]+?)(?:\s*[,!?.]|$)/i,
    /(?:I want|I'd love|let's|I'm thinking)\s+(?:to go to|to visit|to travel to|about)?\s*([A-Z][a-zA-Z\s]+?)(?:\s*[,!?.]|$)/i,
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}
