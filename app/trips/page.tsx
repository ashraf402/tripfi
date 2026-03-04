import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TripsDashboard } from "@/components/trips/TripsDashboard";

export default async function TripsPage({
  searchParams,
}: {
  searchParams: { confirmed?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trips } = await supabase
    .from("trips")
    .select(
      `
      *,
      bookings (
        id,
        total_usd,
        total_bch,
        bch_rate_at_booking,
        flight_cost,
        hotel_cost,
        activities_cost,
        taxes_and_fees,
        destination_city,
        departure_date,
        return_date,
        travelers,
        trip_days,
        flight_data,
        hotel_data,
        itinerary_data,
        payment_transactions (
          amount_bch,
          status,
          confirmed_at,
          is_testnet
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <TripsDashboard trips={trips ?? []} confirmedId={searchParams.confirmed} />
  );
}
