import { amadeus } from "./amadeus";
import axios from "axios";
import { getBchRate, usdToBch } from "@/lib/services/bchRate";
import type { Flight, FlightData } from "@/lib/types/chat";

function extractErrorMessage(error: any): string {
  try {
    // If it stringifies to [object Object]
    // force a full JSON dump
    if (typeof error === "object") {
      // Amadeus SDK v6+ error format
      if (error?.description?.[0]?.detail) {
        return error.description[0].detail;
      }
      if (error?.description?.[0]?.title) {
        return error.description[0].title;
      }
      if (Array.isArray(error?.description)) {
        return JSON.stringify(error.description);
      }
      if (typeof error?.description === "string") {
        return error.description;
      }
      // Amadeus response errors
      if (error?.response?.result?.errors) {
        return JSON.stringify(error.response.result.errors);
      }
      // HTTP response body
      if (error?.response?.body) {
        return JSON.stringify(error.response.body);
      }
      // Standard JS error
      if (error?.message) {
        return error.message;
      }
      // Nuclear option — dump everything
      return JSON.stringify(error);
    }
    return String(error);
  } catch {
    return "Unknown Amadeus error";
  }
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD
  adults: number;
  travelClass?: "ECONOMY" | "BUSINESS" | "FIRST";
  maxResults?: number;
}

// ── Amadeus (Primary) ──────────────────────────────────

async function searchFlightsAmadeus(
  params: FlightSearchParams,
): Promise<FlightData> {
  console.log(
    `[FlightService] Searching Amadeus: ` +
      `${params.origin}→${params.destination} on ${params.departureDate}`,
  );

  const bchRate = await getBchRate();

  let response;
  try {
    response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: params.origin.toUpperCase(),
      destinationLocationCode: params.destination.toUpperCase(),
      departureDate: params.departureDate,
      ...(params.returnDate && {
        returnDate: params.returnDate,
      }),
      adults: params.adults,
      travelClass: params.travelClass ?? "ECONOMY",
      max: params.maxResults ?? 5,
      currencyCode: "USD",
    });

    if (!response.data || response.data.length === 0) {
      throw new Error(
        `[FlightService] No flights found: ` +
          `${params.origin}→${params.destination} ` +
          `on ${params.departureDate}`,
      );
    }
  } catch (error: any) {
    throw new Error(
      `[FlightService] Amadeus error: ` + extractErrorMessage(error),
    );
  }

  const flights: Flight[] = response.data.map((offer: any, index: number) => {
    const itinerary = offer.itineraries[0];
    const segment = itinerary.segments[0];
    const lastSegment = itinerary.segments[itinerary.segments.length - 1];
    const priceUsd = parseFloat(offer.price.total);

    const duration = itinerary.duration
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m")
      .toLowerCase()
      .trim();

    const stops = itinerary.segments.length - 1;

    return {
      id: offer.id ?? `amadeus-${index}`,
      airline: segment.carrierCode,
      airlineCode: segment.carrierCode,
      flightNumber: `${segment.carrierCode}${segment.number}`,
      origin: segment.departure.iataCode,
      originCity: segment.departure.iataCode,
      destination: lastSegment.arrival.iataCode,
      destinationCity: lastSegment.arrival.iataCode,
      departureTime: segment.departure.at,
      arrivalTime: lastSegment.arrival.at,
      duration,
      stops,
      stopsCities:
        stops > 0
          ? itinerary.segments.slice(0, -1).map((s: any) => s.arrival.iataCode)
          : [],
      priceUsd,
      priceBch: usdToBch(priceUsd, bchRate),
      cabin: (offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ??
        "ECONOMY") as Flight["cabin"],
      seatsLeft: offer.numberOfBookableSeats,
      bookingUrl: "https://www.amadeus.com",
    };
  });

  console.log(`[FlightService] Amadeus: ${flights.length} real flights`);

  return {
    flights,
    searchParams: {
      origin: params.origin,
      destination: params.destination,
      date: params.departureDate,
      passengers: params.adults,
    },
  };
}

// ── Kiwi (Activated when KIWI_ENABLED=true) ───────────

async function searchFlightsKiwi(
  params: FlightSearchParams,
): Promise<FlightData> {
  if (!process.env.KIWI_API_KEY) {
    throw new Error("[FlightService] KIWI_API_KEY not set in .env");
  }

  console.log(
    `[FlightService] Searching Kiwi: ` +
      `${params.origin}→${params.destination}`,
  );

  const bchRate = await getBchRate();

  const { data } = await axios.get("https://tequila.kiwi.com/v2/search", {
    headers: { apikey: process.env.KIWI_API_KEY },
    params: {
      fly_from: params.origin,
      fly_to: params.destination,
      date_from: params.departureDate,
      date_to: params.departureDate,
      adults: params.adults,
      selected_cabins: params.travelClass ?? "M",
      limit: params.maxResults ?? 5,
      curr: "USD",
    },
    timeout: 15000,
  });

  if (!data.data || data.data.length === 0) {
    throw new Error(
      `[FlightService] Kiwi: no flights found ` +
        `${params.origin}→${params.destination}`,
    );
  }

  const flights: Flight[] = data.data.map((offer: any, index: number) => {
    const priceUsd = offer.price as number;
    return {
      id: offer.id ?? `kiwi-${index}`,
      airline: offer.airlines?.[0] ?? "Unknown",
      airlineCode: offer.airlines?.[0] ?? "XX",
      flightNumber: offer.airlines?.[0] ?? "XX000",
      origin: offer.flyFrom,
      originCity: offer.cityFrom,
      destination: offer.flyTo,
      destinationCity: offer.cityTo,
      departureTime: new Date(offer.dTime * 1000).toISOString(),
      arrivalTime: new Date(offer.aTime * 1000).toISOString(),
      duration:
        `${Math.floor(offer.fly_duration / 3600)}h ` +
        `${Math.floor((offer.fly_duration % 3600) / 60)}m`,
      stops: (offer.route?.length ?? 1) - 1,
      priceUsd,
      priceBch: usdToBch(priceUsd, bchRate),
      cabin: "Economy",
      bookingUrl: offer.deep_link ?? "https://kiwi.com",
    };
  });

  console.log(`[FlightService] Kiwi: ${flights.length} real flights`);

  return {
    flights,
    searchParams: {
      origin: params.origin,
      destination: params.destination,
      date: params.departureDate,
      passengers: params.adults,
    },
  };
}

// ── Main Export ────────────────────────────────────────
// Kiwi if enabled → Amadeus if Kiwi disabled/fails
// No mock fallback. Ever.

export async function searchFlights(
  params: FlightSearchParams,
): Promise<FlightData> {
  const kiwiEnabled =
    process.env.KIWI_ENABLED === "true" && !!process.env.KIWI_API_KEY;

  if (kiwiEnabled) {
    try {
      return await searchFlightsKiwi(params);
    } catch (error: any) {
      console.warn(
        "[FlightService] Kiwi failed, trying Amadeus:",
        error.message,
      );
      // Fall through to Amadeus — not mock data
    }
  }

  // Throws if Amadeus fails — orchestrator handles it
  return await searchFlightsAmadeus(params);
}

// ── Airport Search ─────────────────────────────────────

export async function searchAirports(keyword: string): Promise<
  {
    iataCode: string;
    name: string;
    city: string;
  }[]
> {
  console.log(`[FlightService] Searching airports: "${keyword}"`);

  const response = await amadeus.referenceData.locations.get({
    keyword,
    subType: "AIRPORT,CITY",
  });

  if (!response.data || response.data.length === 0) {
    throw new Error(`[FlightService] No airports found for: ${keyword}`);
  }

  return response.data.map((loc: any) => ({
    iataCode: loc.iataCode,
    name: loc.name,
    city: loc.address?.cityName ?? loc.name,
  }));
}
