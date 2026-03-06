"use server";

import axios from "axios";

const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  console.warn("[Unsplash] UNSPLASH_ACCESS_KEY " + "is not set in .env");
}

const BASE_URL = "https://api.unsplash.com";

// In-memory cache to avoid hitting rate limits
// Unsplash free tier: 50 requests/hour
const queryCache = new Map<string, string[]>();

function getSeedNumber(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    links: { html: string };
  };
  links: { html: string };
}

// Core search function

async function searchPhoto(
  query: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
  seed?: string,
): Promise<string | null> {
  // Return cached result if available
  const cacheKey = `${query}-${orientation}`;

  if (!queryCache.has(cacheKey)) {
    try {
      const { data } = await axios.get(`${BASE_URL}/search/photos`, {
        params: {
          query,
          orientation,
          per_page: 15,
          order_by: "relevant",
          content_filter: "high",
        },
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
          "Accept-Version": "v1",
        },
        timeout: 5000,
      });

      const urls = (data?.results || [])
        .map((p: any) => p.urls?.regular)
        .filter(Boolean);

      if (urls.length > 0) {
        queryCache.set(cacheKey, urls);
        console.log(`[Unsplash] Found ${urls.length} images for "${query}"`);
      } else {
        queryCache.set(cacheKey, []);
      }
    } catch (error: any) {
      console.warn(`[Unsplash] Failed for "${query}":`, error.message);
      return null;
    }
  }

  const urls = queryCache.get(cacheKey) || [];
  if (urls.length === 0) return null;

  const index = seed ? getSeedNumber(seed) % urls.length : 0;
  return urls[index];
}

// Pexels fallback

const PEXELS_KEY = process.env.PEXELS_API_KEY;

async function searchPhotoPexels(
  query: string,
  orientation: "landscape" | "portrait" | "square" = "landscape",
  seed?: string,
): Promise<string | null> {
  if (!PEXELS_KEY) return null;

  const cacheKey = `pexels-${query}-${orientation}`;

  if (!queryCache.has(cacheKey)) {
    try {
      const { data } = await axios.get("https://api.pexels.com/v1/search", {
        params: {
          query,
          orientation,
          per_page: 15,
          size: "medium",
        },
        headers: {
          Authorization: PEXELS_KEY,
        },
        timeout: 5000,
      });

      const urls = (data?.photos || [])
        .map((p: any) => p.src?.large2x ?? p.src?.large ?? p.src?.medium)
        .filter(Boolean);

      if (urls.length > 0) {
        queryCache.set(cacheKey, urls);
        console.log(`[Pexels] Found ${urls.length} images for "${query}"`);
      } else {
        queryCache.set(cacheKey, []);
      }
    } catch (error: any) {
      console.warn(`[Pexels] Failed for "${query}":`, error.message);
      return null;
    }
  }

  const urls = queryCache.get(cacheKey) || [];
  if (urls.length === 0) return null;

  const index = seed ? getSeedNumber(seed) % urls.length : 0;
  return urls[index];
}

// Provider chain
// Unsplash first → Pexels fallback →
// source.unsplash.com static fallback

async function getImageWithFallback(
  query: string,
  orientation: "landscape" | "portrait" | "squarish" = "landscape",
  staticFallback: string,
  seed?: string,
): Promise<string> {
  // 1. Try Unsplash
  const unsplashResult = await searchPhoto(query, orientation, seed);
  if (unsplashResult) return unsplashResult;

  console.log(
    `[ImageService] Unsplash miss for "${query}"` + ` — trying Pexels...`,
  );

  // 2. Try Pexels
  // Pexels uses 'square' instead of 'squarish'
  const pexelsOrientation = orientation === "squarish" ? "square" : orientation;

  const pexelsResult = await searchPhotoPexels(query, pexelsOrientation, seed);
  if (pexelsResult) return pexelsResult;

  // 3. Static fallback
  console.log(
    `[ImageService] Pexels miss for "${query}"` + ` — using static fallback`,
  );
  return staticFallback;
}

// Public helpers

export async function getHotelImage(
  hotelName: string,
  city: string,
): Promise<string> {
  const seed = `${hotelName}-${city}`;
  return getImageWithFallback(
    `luxury hotel room interior`,
    "landscape",
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`,
    seed,
  );
}

export async function getActivityImage(
  activityName: string,
  category: string,
  city: string,
): Promise<string> {
  const query =
    category === "Restaurant" || category === "Café"
      ? `restaurant food dining interior`
      : category === "Museum"
        ? `museum art exhibition interior`
        : category === "Beach"
          ? `beach ocean landscape`
          : category === "Park"
            ? `park nature trees landscape`
            : category === "Nightlife"
              ? `nightlife pub club`
              : category === "Shopping"
                ? `shopping mall store interior`
                : `${category} travel interior`;

  const seed = `${activityName}-${city}`;
  return getImageWithFallback(
    query,
    "landscape",
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`,
    seed,
  );
}

export async function getDestinationImage(cityName: string): Promise<string> {
  const seed = cityName;
  return getImageWithFallback(
    `${cityName} city skyline landmark`,
    "landscape",
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`,
    seed,
  );
}

export async function getFlightImage(airlineCode?: string): Promise<string> {
  const seed = airlineCode || "flight";
  return getImageWithFallback(
    "airplane flying sky clouds",
    "landscape",
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`,
    seed,
  );
}

// Airline logo utility removed and moved to imageHelpers.ts
