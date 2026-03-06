export {
  getHotelImage,
  getActivityImage,
  getDestinationImage,
  getFlightImage,
} from "@/lib/services/images/imageService";

// Airline logo (airhex — free, no key)
export function getAirlineLogoUrl(airlineCode: string): string {
  return (
    `https://content.airhex.com/content/logos/` +
    `airlines_${airlineCode}_35_35_s.png`
  );
}
