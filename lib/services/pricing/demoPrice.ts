import { IS_TESTNET } from "@/lib/services/payment/bchPayment";

function randomBetween(min: number, max: number): number {
  const raw = Math.random() * (max - min) + min;
  return Math.round(raw * 100) / 100;
}

export interface DemoPriceInput {
  nights: number;
  activityCount: number;
}

export interface DemoPriceOutput {
  flightCost: number;
  hotelCost: number;
  activitiesCost: number;
  taxesAndFees: number;
  total: number;
}

export function generateDemoPrices(input: DemoPriceInput): DemoPriceOutput {
  const { nights, activityCount } = input;

  // Flight: most expensive single item
  // Range: $8 - $18 flat (round trip feel)
  // Range: $0.5 - $1.50 flat (round trip feel)
  const flightCost = randomBetween(0.5, 1.5);

  // Hotel: mid-range per night
  // Range: $0.3 - $0.7 per night
  const perNight = randomBetween(0.3, 0.7);
  const hotelCost = Math.round(perNight * Math.max(nights, 1) * 100) / 100;

  // Activities: cheapest per item
  // Range: $0.05 - $0.20 per activity
  // Capped at 8 activities max
  const effectiveActivities = Math.min(activityCount, 8);
  const activitiesRaw = Array.from({ length: effectiveActivities }).reduce(
    (sum: number) => sum + randomBetween(0.05, 0.2),
    0,
  );
  const activitiesCost = Math.round((activitiesRaw as number) * 100) / 100;

  // Taxes and fees: always 15% of subtotal
  const subtotal = flightCost + hotelCost + activitiesCost;
  const taxesAndFees = Math.round(subtotal * 0.15 * 100) / 100;

  const total =
    Math.round((flightCost + hotelCost + activitiesCost + taxesAndFees) * 100) /
    100;

  return {
    flightCost,
    hotelCost,
    activitiesCost,
    taxesAndFees,
    total,
  };
}

/**
 * Returns demo prices on testnet, null on mainnet (use real prices).
 * Call this from the orchestrator before using real API prices.
 */
export function getDemoPricesIfTestnet(
  input: DemoPriceInput,
): DemoPriceOutput | null {
  if (!IS_TESTNET) return null;
  return generateDemoPrices(input);
}
