import { createClient } from "@/lib/supabase/server";
import {
  buildPaymentInvoice,
  buildBCHPaymentURI,
  IS_TESTNET,
} from "@/lib/services/payment/bchPayment";
import { sanitizeText } from "@/lib/utils/sanitize";

export async function POST(req: Request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    itineraryId,
    conversationId,
    origin,
    destination,
    destinationCity,
    departureDate,
    returnDate,
    travelers,
    tripDays,
    travelStyle,
    totalUsd,
    flightCost,
    hotelCost,
    activitiesCost,
    taxesAndFees,
    flightData,
    hotelData,
    itineraryData,
  } = body;

  // Sanitize string fields before database insert
  const cleanOrigin = sanitizeText(origin ?? "").value;
  const cleanDestination = sanitizeText(destination ?? "").value;
  const cleanDestinationCity = sanitizeText(destinationCity ?? "").value;
  const cleanTravelStyle = sanitizeText(travelStyle ?? "").value;

  try {
    // 1. Get total bookings count to generate a unique HD wallet index
    const { count } = await supabase
      .from("bookings")
      .select("*", { count: "exact", head: true });

    const bookingIndex = count ?? 0;

    // 2. Get live BCH rate and build invoice (address + amount)
    const { getBchRate } = await import("@/lib/services/bchRate");
    const bchRate = await getBchRate();
    const totalBch = totalUsd / bchRate;

    const invoice = await buildPaymentInvoice(
      "temp", // placeholder — replaced below after booking row created
      bookingIndex,
      totalUsd,
    );

    const paymentUri = buildBCHPaymentURI(
      invoice.paymentAddress,
      invoice.amountBch,
      "TripFi booking",
    );

    // 3. Create booking row — persist address so it can be restored later
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        itinerary_id: itineraryId ?? null,
        conversation_id: conversationId,
        origin: cleanOrigin,
        destination: cleanDestination,
        destination_city: cleanDestinationCity,
        departure_date: departureDate,
        return_date: returnDate,
        travelers,
        trip_days: tripDays,
        travel_style: cleanTravelStyle,
        total_usd: totalUsd,
        total_bch: totalBch,
        flight_cost: flightCost ?? 0,
        hotel_cost: hotelCost ?? 0,
        activities_cost: activitiesCost ?? 0,
        taxes_and_fees: taxesAndFees ?? 0,
        bch_rate_at_booking: invoice.bchRate,
        payment_address: invoice.paymentAddress,
        amount_bch: invoice.amountBch,
        payment_uri: paymentUri,
        flight_data: flightData,
        hotel_data: hotelData,
        itinerary_data: itineraryData,
        status: "pending",
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 4. Save payment transaction
    await supabase.from("payment_transactions").insert({
      booking_id: booking.id,
      user_id: user.id,
      payment_id: invoice.paymentAddress,
      payment_url: null,
      amount_bch: invoice.amountBch,
      amount_usd: invoice.amountUsd,
      status: "pending",
      is_testnet: IS_TESTNET,
    });

    return Response.json({
      bookingId: booking.id,
      paymentAddress: invoice.paymentAddress,
      amountBch: invoice.amountBch,
      amountUsd: invoice.amountUsd,
      bchRate: invoice.bchRate,
      paymentUri,
      network: invoice.network,
      networkLabel: invoice.networkLabel,
      costs: {
        flightCost: flightCost ?? 0,
        hotelCost: hotelCost ?? 0,
        activitiesCost: activitiesCost ?? 0,
        taxesAndFees: taxesAndFees ?? 0,
        total: totalUsd,
      },
    });
  } catch (error: any) {
    console.error("[Booking] Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
