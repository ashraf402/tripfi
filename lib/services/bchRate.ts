import axios from "axios";

// In-memory cache — 5 minute TTL
let cachedRate: number | null = null;
let cacheTimestamp: number | null = null;
let inFlightRequest: Promise<number> | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000;

export async function getBchRate(): Promise<number> {
  const now = Date.now();

  // Return cached rate if still fresh
  if (
    cachedRate !== null &&
    cacheTimestamp !== null &&
    now - cacheTimestamp < CACHE_TTL_MS
  ) {
    console.log(`[BCHRate] Cached: $${cachedRate}`);
    return cachedRate;
  }

  // Return in-flight request if one is already running
  if (inFlightRequest) {
    console.log("[BCHRate] Joining in-flight request");
    return inFlightRequest;
  }

  console.log("[BCHRate] Fetching live rate from CoinGecko...");

  // Start new request and store the promise
  inFlightRequest = axios
    .get("https://api.coingecko.com/api/v3/simple/price", {
      params: {
        ids: "bitcoin-cash",
        vs_currencies: "usd",
      },
      timeout: 8000,
    })
    .then(({ data }) => {
      const rate = data["bitcoin-cash"]?.usd as number;

      if (!rate || rate <= 0) {
        throw new Error(
          "[BCHRate] CoinGecko returned invalid rate. Check your network connection.",
        );
      }

      cachedRate = rate;
      cacheTimestamp = Date.now();
      console.log(`[BCHRate] Live rate: $${rate}`);
      return rate;
    })
    .finally(() => {
      // Clear in-flight lock when done
      inFlightRequest = null;
    });

  return inFlightRequest;
}

export function usdToBch(usd: number, bchRate: number): number {
  if (bchRate <= 0) {
    throw new Error("[BCHRate] Cannot convert — invalid BCH rate");
  }
  return parseFloat((usd / bchRate).toFixed(6));
}
