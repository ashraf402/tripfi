import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { bookingId, paymentId } = await req.json();

  try {
    // 1. Verify payment with Prompt.cash
    const { checkPaymentStatus } =
      await import("@/lib/services/payment/promptcash");
    const status = await checkPaymentStatus(paymentId);

    if (status !== "confirmed") {
      return Response.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    // 2. Update booking status
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId)
      .select()
      .single();

    if (bookingError) {
      throw bookingError;
    }

    // 3. Update payment transaction
    await supabase
      .from("payment_transactions")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("booking_id", bookingId);

    // 4. Create trip record
    const { data: trip } = await supabase
      .from("trips")
      .insert({
        user_id: booking.user_id,
        booking_id: booking.id,
        title: `${booking.trip_days} Days in ` + `${booking.destination_city}`,
        destination: booking.destination,
        destination_city: booking.destination_city,
        departure_date: booking.departure_date,
        return_date: booking.return_date,
        travel_style: booking.travel_style,
        travelers: booking.travelers,
        status: "upcoming",
      })
      .select()
      .single();

    return Response.json({
      success: true,
      tripId: trip?.id,
    });
  } catch (error: any) {
    console.error("[Confirm] Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
