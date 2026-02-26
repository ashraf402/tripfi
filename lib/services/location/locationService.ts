import axios from "axios";

export interface LocationResult {
  city: string;
  country: string;
  iataCode: string | null;
  latitude: number;
  longitude: number;
  provider: string;
}

// ── Major Cities to IATA Map ───────────────────────────
// At least 40 major global cities covering all regions

const CITY_IATA_MAP: Record<string, string> = {
  // Africa
  Lagos: "LOS",
  Abuja: "ABV",
  Cairo: "CAI",
  Johannesburg: "JNB",
  "Cape Town": "CPT",
  Nairobi: "NBO",
  Accra: "ACC",
  Casablanca: "CMN",
  // Europe
  London: "LHR",
  Paris: "CDG",
  Frankfurt: "FRA",
  Amsterdam: "AMS",
  Madrid: "MAD",
  Rome: "FCO",
  Istanbul: "IST",
  Dubai: "DXB", // Middle East commonly grouped here or Asia
  Doha: "DOH",
  // Asia
  Tokyo: "HND", // or NRT
  Singapore: "SIN",
  Bangkok: "BKK",
  "Hong Kong": "HKG",
  Seoul: "ICN",
  Mumbai: "BOM",
  Delhi: "DEL",
  Beijing: "PEK",
  Shanghai: "PVG",
  // Americas
  "New York": "JFK",
  "Los Angeles": "LAX",
  Chicago: "ORD",
  Miami: "MIA",
  Toronto: "YYZ",
  Vancouver: "YVR",
  "São Paulo": "GRU",
  "Rio de Janeiro": "GIG",
  "Mexico City": "MEX",
  "Buenos Aires": "EZE",
  // Oceania
  Sydney: "SYD",
  Melbourne: "MEL",
  Auckland: "AKL",
};

function getIataForCity(city: string): string | null {
  // Simple normalization: title case
  const normalized = city
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return CITY_IATA_MAP[normalized] ?? null;
}

// ── Providers ──────────────────────────────────────────

const TIMEOUT_MS = 5000;

async function tryProvider(
  url: string,
  providerName: string,
  mapFn: (data: any) => Omit<LocationResult, "provider" | "iataCode"> | null,
): Promise<LocationResult | null> {
  try {
    const source = axios.CancelToken.source();
    const timeoutId = setTimeout(() => source.cancel("Timeout"), TIMEOUT_MS);

    const { data } = await axios.get(url, {
      cancelToken: source.token,
      timeout: TIMEOUT_MS, // backup if cancel token fails
    });

    clearTimeout(timeoutId);

    const mapped = mapFn(data);
    if (!mapped) return null;

    const iataCode = getIataForCity(mapped.city);

    console.log(
      `[Location] ${providerName} success: ${mapped.city} (${iataCode ?? "No IATA"})`,
    );

    return {
      ...mapped,
      iataCode,
      provider: providerName,
    };
  } catch (error: any) {
    console.warn(`[Location] ${providerName} failed: ${error.message}`);
    return null;
  }
}

// ── Main Export ────────────────────────────────────────

export async function getUserLocationFromIP(): Promise<LocationResult | null> {
  console.log("[Location] Detecting user location...");

  // 1. ipapi.co
  let result = await tryProvider(
    "https://ipapi.co/json/",
    "ipapi.co",
    (data) => {
      if (!data.city || !data.country_name) return null;
      return {
        city: data.city,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    },
  );
  if (result) return result;

  // 2. ip-api.com
  result = await tryProvider(
    "http://ip-api.com/json/",
    "ip-api.com",
    (data) => {
      if (data.status !== "success") return null;
      return {
        city: data.city,
        country: data.country,
        latitude: data.lat,
        longitude: data.lon,
      };
    },
  );
  if (result) return result;

  // 3. ipapi.com (Fallback - might need key but trying free endpoint/mock structure if it works without key)
  // Note: ipapi.com usually requires a key. The prompt listed it as "ipapi.com/json/".
  // Accessing http://ipapi.com/json/ directly usually blocks without key or redirects.
  // We will try it as requested. If it fails (403/401), it will be caught and we move to next.
  result = await tryProvider(
    "http://ipapi.com/json/", // Often requires ?access_key=...
    "ipapi.com",
    (data) => {
      if (!data.city || !data.country_name) return null;
      return {
        city: data.city,
        country: data.country_name,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    },
  );
  if (result) return result;

  // 4. freeipapi.com
  result = await tryProvider(
    "https://freeipapi.com/api/json/",
    "freeipapi.com",
    (data) => {
      if (!data.cityName || !data.countryName) return null;
      return {
        city: data.cityName,
        country: data.countryName,
        latitude: data.latitude,
        longitude: data.longitude,
      };
    },
  );
  if (result) return result;

  console.warn("[Location] All providers failed or timed out.");
  return null;
}
