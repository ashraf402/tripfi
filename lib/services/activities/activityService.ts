import axios from "axios";
import type { Activity, ActivityData } from "@/lib/types/chat";

const OSM_URL =
  process.env.OSM_OVERPASS_URL ?? "https://overpass-api.de/api/interpreter";

export interface ActivitySearchParams {
  destination: string;
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  maxResults?: number;
  categories?: OSMCategory[];
}

export type OSMCategory =
  | "tourism"
  | "restaurant"
  | "cafe"
  | "museum"
  | "attraction"
  | "beach"
  | "park"
  | "nightclub"
  | "shopping";

const CATEGORY_QUERIES: Record<OSMCategory, string> = {
  tourism: 'node["tourism"~"attraction|museum|viewpoint|zoo|theme_park"]',
  restaurant: 'node["amenity"="restaurant"]',
  cafe: 'node["amenity"="cafe"]',
  museum: 'node["tourism"="museum"]',
  attraction: 'node["tourism"="attraction"]',
  beach: 'node["natural"="beach"]',
  park: 'node["leisure"="park"]',
  nightclub: 'node["amenity"="nightclub"]',
  shopping: 'node["shop"~"mall|department_store|market"]',
};

function getCategoryLabel(tags: any): string {
  if (tags.tourism === "museum") return "Museum";
  if (tags.tourism === "attraction") return "Attraction";
  if (tags.tourism === "viewpoint") return "Viewpoint";
  if (tags.tourism === "zoo") return "Zoo";
  if (tags.amenity === "restaurant") return "Restaurant";
  if (tags.amenity === "cafe") return "Café";
  if (tags.amenity === "nightclub") return "Nightlife";
  if (tags.natural === "beach") return "Beach";
  if (tags.leisure === "park") return "Park";
  if (tags.shop) return "Shopping";
  return "Point of Interest";
}

export async function searchActivities(
  params: ActivitySearchParams,
): Promise<ActivityData> {
  console.log(
    `[ActivityService] Searching OSM: ` +
      `${params.destination} ` +
      `(${params.latitude}, ${params.longitude})`,
  );

  const radius = params.radiusMeters ?? 5000;
  const maxResults = params.maxResults ?? 10;
  const categories = params.categories ?? [
    "tourism",
    "restaurant",
    "museum",
    "beach",
    "park",
  ];

  const nodeQueries = categories
    .map(
      (cat) =>
        `${CATEGORY_QUERIES[cat]}` +
        `(around:${radius},${params.latitude},${params.longitude});`,
    )
    .join("\n");

  const query = `
    [out:json][timeout:25];
    (
      ${nodeQueries}
    );
    out body ${maxResults * 3};
  `;

  const { data } = await axios.post(
    OSM_URL,
    `data=${encodeURIComponent(query)}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 30000,
    },
  );

  const elements = (data.elements as any[])
    .filter((el) => el.tags?.name)
    .slice(0, maxResults);

  if (elements.length === 0) {
    throw new Error(
      `[ActivityService] No activities found near ` + `${params.destination}`,
    );
  }

  const activities: Activity[] = elements.map((el, index) => ({
    id: `osm-${el.id ?? index}`,
    name: el.tags.name,
    category: getCategoryLabel(el.tags),
    location: [
      el.tags["addr:street"],
      el.tags["addr:city"] ?? params.destination,
    ]
      .filter(Boolean)
      .join(", "),
    description:
      el.tags.description ??
      el.tags.wikipedia ??
      `${getCategoryLabel(el.tags)} in ` + `${params.destination}`,
    openingHours: el.tags.opening_hours ?? undefined,
    priceUsd: undefined,
    priceBch: undefined,
    latitude: el.lat,
    longitude: el.lon,
  }));

  console.log(
    `[ActivityService] OSM: ` + `${activities.length} real activities`,
  );

  return {
    activities,
    destination: params.destination,
  };
}

// Geocode city → real coordinates
// Uses Nominatim (OSM) — free, no key needed

export async function geocodeCity(cityName: string): Promise<{
  lat: number;
  lng: number;
  displayName: string;
}> {
  console.log(`[ActivityService] Geocoding: "${cityName}"`);

  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: cityName,
        format: "json",
        limit: 1,
      },
      headers: {
        // Required by Nominatim ToS
        "User-Agent": "TripFi/1.0 (tripfi.app)",
      },
      timeout: 10000,
    },
  );

  if (!data || data.length === 0) {
    throw new Error(
      `[ActivityService] Cannot geocode: "${cityName}". ` +
        `Try a different city name.`,
    );
  }

  const result = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };

  console.log(
    `[ActivityService] Geocoded "${cityName}": ` +
      `${result.lat}, ${result.lng}`,
  );

  return result;
}
