import axios from "axios";

const BASE_URL = "https://api.aviationstack.com/v1";

if (!process.env.AVIATIONSTACK_API_KEY) {
  throw new Error(
    "[Aviationstack] AVIATIONSTACK_API_KEY not set in .env. " +
      "Get your key at aviationstack.com",
  );
}

export interface FlightStatus {
  flightNumber: string;
  airline: string;
  status:
    | "scheduled"
    | "active"
    | "landed"
    | "cancelled"
    | "incident"
    | "diverted";
  departure: {
    airport: string;
    iataCode: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    delay?: number;
  };
  arrival: {
    airport: string;
    iataCode: string;
    scheduled: string;
    estimated?: string;
    actual?: string;
    delay?: number;
  };
  aircraft?: string;
}

export async function getFlightStatus(
  flightIata: string,
): Promise<FlightStatus | null> {
  console.log(`[Aviationstack] Checking status: ${flightIata}`);

  const { data } = await axios.get(`${BASE_URL}/flights`, {
    params: {
      access_key: process.env.AVIATIONSTACK_API_KEY,
      flight_iata: flightIata.toUpperCase(),
      limit: 1,
    },
    timeout: 10000,
  });

  const flight = data?.data?.[0];

  // null = flight not currently active — valid
  if (!flight) {
    console.log(`[Aviationstack] No active flight: ${flightIata}`);
    return null;
  }

  console.log(
    `[Aviationstack] Real status: ` +
      `${flight.flight?.iata} — ${flight.flight_status}`,
  );

  return {
    flightNumber: flight.flight?.iata ?? flightIata,
    airline: flight.airline?.name ?? "Unknown",
    status: flight.flight_status ?? "scheduled",
    departure: {
      airport: flight.departure?.airport ?? "",
      iataCode: flight.departure?.iata ?? "",
      scheduled: flight.departure?.scheduled ?? "",
      estimated: flight.departure?.estimated,
      actual: flight.departure?.actual,
      delay: flight.departure?.delay,
    },
    arrival: {
      airport: flight.arrival?.airport ?? "",
      iataCode: flight.arrival?.iata ?? "",
      scheduled: flight.arrival?.scheduled ?? "",
      estimated: flight.arrival?.estimated,
      actual: flight.arrival?.actual,
      delay: flight.arrival?.delay,
    },
    aircraft: flight.aircraft?.registration,
  };
}

export async function searchRoutes(params: {
  origin: string;
  destination: string;
}): Promise<
  {
    airline: string;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
  }[]
> {
  console.log(
    `[Aviationstack] Routes: ` + `${params.origin}→${params.destination}`,
  );

  const { data } = await axios.get(`${BASE_URL}/routes`, {
    params: {
      access_key: process.env.AVIATIONSTACK_API_KEY,
      dep_iata: params.origin.toUpperCase(),
      arr_iata: params.destination.toUpperCase(),
      limit: 5,
    },
    timeout: 10000,
  });

  if (!data?.data || data.data.length === 0) {
    throw new Error(
      `[Aviationstack] No routes found: ` +
        `${params.origin}→${params.destination}`,
    );
  }

  return data.data.map((route: any) => ({
    airline: route.airline?.name ?? "Unknown",
    flightNumber: route.flight?.iata ?? "",
    departureTime: route.departure?.time ?? "",
    arrivalTime: route.arrival?.time ?? "",
  }));
}
