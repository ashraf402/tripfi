import { createClient } from "@/lib/supabase/server";
import { checkAddressReceived } from "@/lib/services/payment/bchPayment";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("booking_id");

  if (!bookingId) {
    return Response.json({ error: "Missing booking_id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: tx } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  if (!tx || !tx.payment_id || tx.amount_bch == null) {
    return Response.json({ status: "pending" });
  }

  if (tx.status === "confirmed") {
    return Response.json({ status: "confirmed" });
  }

  const result = await checkAddressReceived(tx.payment_id, tx.amount_bch);

  if (result.status === "confirmed") {
    await supabase
      .from("payment_transactions")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", tx.id);

    await supabase
      .from("bookings")
      .update({ status: "confirmed" })
      .eq("id", bookingId);

    const { data: booking } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (!booking) {
      throw new Error("Booking not found");
    }

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

    if (!trip) {
      throw new Error("Failed to create trip");
    }

    return Response.json({
      status: "confirmed",
      tripId: trip.id,
      txHash: result.txHash,
      explorerUrl: result.explorerUrl,
    });
  }

  return Response.json({
    status: result.status,
    receivedBch: result.receivedBch,
    expectedBch: result.expectedBch,
  });
}
