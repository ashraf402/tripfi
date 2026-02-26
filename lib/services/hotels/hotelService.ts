import { amadeus } from "../flights/amadeus";
import { getBchRate, usdToBch } from "@/lib/services/bchRate";
import type { Hotel, HotelData } from "@/lib/types/chat";

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

export interface HotelSearchParams {
  cityCode: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  roomQuantity?: number;
  maxResults?: number;
}

export async function searchHotels(
  params: HotelSearchParams,
): Promise<HotelData> {
  console.log(
    `[HotelService] Searching Amadeus: ` +
      `${params.cityCode} ` +
      `${params.checkInDate}→${params.checkOutDate}`,
  );

  const bchRate = await getBchRate();

  let hotelList;
  let offersResponse;
  let hotelIds;

  try {
    // Step 1: Get hotels in city
    hotelList = await amadeus.referenceData.locations.hotels.byCity.get({
      cityCode: params.cityCode.toUpperCase(),
    });

    if (!hotelList.data || hotelList.data.length === 0) {
      throw new Error(
        `[HotelService] No hotels found in: ` + `${params.cityCode}`,
      );
    }

    // Step 2: Cap at 20 IDs to avoid rate limits
    hotelIds = hotelList.data.slice(0, 20).map((h: any) => h.hotelId);

    // Step 3: Get offers
    offersResponse = await amadeus.shopping.hotelOffersSearch.get({
      hotelIds: hotelIds.join(","),
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      adults: params.adults,
      roomQuantity: params.roomQuantity ?? 1,
      bestRateOnly: true,
      currency: "USD",
    });

    if (!offersResponse.data || offersResponse.data.length === 0) {
      throw new Error(
        `[HotelService] No hotel offers available: ` +
          `${params.cityCode} ` +
          `${params.checkInDate}→${params.checkOutDate}`,
      );
    }
  } catch (error: any) {
    throw new Error(
      `[HotelService] Amadeus error: ` + extractErrorMessage(error),
    );
  }

  // Step 4: Calculate nights
  const nights = Math.ceil(
    (new Date(params.checkOutDate).getTime() -
      new Date(params.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  // Step 5: Map to Hotel type
  const hotels: Hotel[] = offersResponse.data
    .slice(0, params.maxResults ?? 5)
    .map((item: any, index: number) => {
      const hotel = item.hotel;
      const offer = item.offers?.[0];
      const pricePerNight = parseFloat(
        offer?.price?.base ?? offer?.price?.total ?? "0",
      );
      const totalPrice = pricePerNight * nights;

      const amenities: string[] = hotel.amenities
        ?.slice(0, 6)
        .map((a: string) =>
          a
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
        ) ?? ["WiFi", "Air Conditioning"];

      return {
        id: hotel.hotelId ?? `hotel-${index}`,
        name: hotel.name ?? "Unknown Hotel",
        stars: hotel.rating ? parseInt(hotel.rating) : 3,
        location: hotel.address?.lines?.[0] ?? params.cityCode,
        city: hotel.address?.cityName ?? params.cityCode,
        imageUrl: undefined,
        amenities,
        pricePerNightUsd: pricePerNight,
        pricePerNightBch: usdToBch(pricePerNight, bchRate),
        totalPriceUsd: totalPrice,
        totalPriceBch: usdToBch(totalPrice, bchRate),
        nights,
        rating: hotel.rating ? parseFloat(hotel.rating) : undefined,
        reviewCount: undefined,
        bookingUrl: "https://www.amadeus.com",
        latitude: hotel.latitude,
        longitude: hotel.longitude,
      };
    });

  console.log(`[HotelService] Amadeus: ${hotels.length} real hotels`);

  return {
    hotels,
    searchParams: {
      destination: params.cityCode,
      checkIn: params.checkInDate,
      checkOut: params.checkOutDate,
      guests: params.adults,
    },
  };
}
