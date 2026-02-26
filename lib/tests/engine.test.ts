import { describe, it, expect, beforeAll } from "vitest";
import { getUserLocationFromIP } from "@/lib/services/location/locationService";
import {
  searchFlights,
  searchAirports,
} from "@/lib/services/flights/flightService";
import { searchHotels } from "@/lib/services/hotels/hotelService";
import {
  searchActivities,
  geocodeCity,
} from "@/lib/services/activities/activityService";
import { getBchRate } from "@/lib/services/bchRate";
import { orchestrate } from "@/lib/ai/orchestrator";

// ── Environment Verification ───────────────────────────

describe("Environment Setup", () => {
  it("should have all required API keys", () => {
    expect(process.env.GROQ_API_KEY).toBeDefined();
    expect(process.env.GOOGLE_AI_KEY).toBeDefined();
    expect(process.env.AMADEUS_CLIENT_ID).toBeDefined();
    expect(process.env.AMADEUS_CLIENT_SECRET).toBeDefined();
    expect(process.env.AVIATIONSTACK_API_KEY).toBeDefined();
  });
});

// ── Location Service ───────────────────────────────────

describe("Location Service", () => {
  it("should detect user location (or return null gracefully)", async () => {
    // Note: This might return null in CI/CD without internet access
    // But it should NOT throw
    const location = await getUserLocationFromIP();

    if (location) {
      expect(location.city).toBeDefined();
      expect(location.country).toBeDefined();
      expect(location.provider).toBeDefined();
      console.log("Detected:", location.city, location.iataCode);
    } else {
      console.log(
        "Location detection failed gracefully (expected in some envs)",
      );
    }
  });
});

// ── BCH Rate Service ───────────────────────────────────

describe("BCH Rate Service", () => {
  it("should fetch live BCH price", async () => {
    const rate = await getBchRate();
    expect(rate).toBeGreaterThan(0);
    console.log("Current BCH Price:", rate);
  });
});

// ── Flight Service (Real API) ──────────────────────────

describe("Flight Service", () => {
  it("should search airports by keyword", async () => {
    const airports = await searchAirports("London");
    expect(airports.length).toBeGreaterThan(0);
    expect(airports[0].iataCode).toBeDefined();
  });

  it("should find flights from LHR to JFK", async () => {
    // Future date to ensure availability
    const date = new Date();
    date.setDate(date.getDate() + 60);
    const departureDate = date.toISOString().split("T")[0];

    const result = await searchFlights({
      origin: "LHR",
      destination: "JFK",
      departureDate,
      adults: 1,
    });

    expect(result.flights.length).toBeGreaterThan(0);
    expect(result.flights[0].priceUsd).toBeGreaterThan(0);
    expect(result.flights[0].priceBch).toBeGreaterThan(0);
    expect(result.flights[0].bookingUrl).toBeDefined();
  }, 30000); // 30s timeout for Amadeus
});

// ── Hotel Service (Real API) ───────────────────────────

describe("Hotel Service", () => {
  it("should find hotels in Paris", async () => {
    const date = new Date();
    date.setDate(date.getDate() + 60);
    const checkIn = date.toISOString().split("T")[0];

    const date2 = new Date(date);
    date2.setDate(date2.getDate() + 3);
    const checkOut = date2.toISOString().split("T")[0];

    const result = await searchHotels({
      cityCode: "PAR",
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults: 1,
    });

    expect(result.hotels.length).toBeGreaterThan(0);
    expect(result.hotels[0].name).toBeDefined();
    expect(result.hotels[0].pricePerNightUsd).toBeGreaterThan(0);
  }, 30000);
});

// ── Activity Service (Real API) ────────────────────────

describe("Activity Service", () => {
  it('should geocode "Barcelona"', async () => {
    const coords = await geocodeCity("Barcelona");
    expect(coords.lat).toBeDefined();
    expect(coords.lng).toBeDefined();
  });

  it("should find activities in Barcelona", async () => {
    const coords = await geocodeCity("Barcelona");
    const result = await searchActivities({
      destination: "Barcelona",
      latitude: coords.lat,
      longitude: coords.lng,
    });

    expect(result.activities.length).toBeGreaterThan(0);
    expect(result.activities[0].name).toBeDefined();
  }, 30000);
});

// ── AI Orchestrator (Integration) ──────────────────────

describe("AI Orchestrator", () => {
  it('should handle "flight status" intent', async () => {
    const response = await orchestrate(
      "Check status of flight BA117",
      [],
      "LHR",
    );
    if (response.component === "FlightStatusCard") {
      expect(response.data).toBeDefined();
    } else {
      // Fallback or specific handling check
      expect(response.message).toBeDefined();
    }
  }, 30000);

  it("should plan a trip to Tokyo", async () => {
    const response = await orchestrate("Plan a 5 day trip to Tokyo", [], "LHR");

    expect(response.component).toBe("ItineraryCard");
    expect(response.data).toBeDefined();
    const data = response.data as any;
    expect(data.days.length).toBe(5);
    expect(data.totalCostBch).toBeGreaterThan(0);
  }, 60000); // 60s timeout for multi-agent plan
});
