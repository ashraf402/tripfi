import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Row shape after the schema migration adds the new columns.
// We use a local interface + cast to avoid compile errors when
// Supabase generated types haven't been regenerated yet.
interface BookingRow {
  id: string;
  payment_address: string | null;
  amount_bch: number | null;
  amount_usd: number | null;
  bch_rate_at_booking: number | null;
  payment_uri: string | null;
  status: string;
  itinerary_id: string | null;
  flight_cost: number | null;
  hotel_cost: number | null;
  activities_cost: number | null;
  taxes_and_fees: number | null;
  total_usd: number | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itineraryId = searchParams.get("itinerary_id");

  if (!itineraryId) {
    return NextResponse.json(
      { error: "itinerary_id required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find most recent pending booking for this itinerary and user.
  // Cast to `any` first to avoid SelectQueryError from columns that
  // exist in Supabase after migration but not in the generated types yet.
  const { data: booking } = (await supabase
    .from("bookings")
    .select("*")
    .eq("user_id", user.id)
    .eq("itinerary_id" as any, itineraryId)
    .eq("status" as any, "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()) as { data: BookingRow | null; error: unknown };

  if (!booking || !booking.payment_address) {
    // No pending booking found — BookingModal should call create
    return NextResponse.json({ exists: false }, { status: 200 });
  }

  // Pending booking found — return invoice so BookingModal can restore state
  return NextResponse.json({
    exists: true,
    invoice: {
      bookingId: booking.id,
      paymentAddress: booking.payment_address,
      amountBch: booking.amount_bch,
      amountUsd: booking.total_usd,
      bchRate: booking.bch_rate_at_booking,
      paymentUri: booking.payment_uri,
      costs: {
        flightCost: booking.flight_cost,
        hotelCost: booking.hotel_cost,
        activitiesCost: booking.activities_cost,
        taxesAndFees: booking.taxes_and_fees,
        total: booking.total_usd,
      },
    },
  });
}
