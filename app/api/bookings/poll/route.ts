import { createClient } from "@/lib/supabase/server";
import { checkAddressReceived } from "@/lib/services/payment/blockchain";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("booking_id");

  console.log(
    `\n[POLL API] --- New poll request for booking_id: ${bookingId} ---`,
  );

  if (!bookingId) {
    console.log(`[POLL API] Error: Missing booking_id`);
    return Response.json({ error: "Missing booking_id" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: tx } = await supabase
    .from("payment_transactions")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  console.log(
    `[POLL API] DB transaction record:`,
    tx
      ? {
          id: tx.id,
          status: tx.status,
          payment_id: tx.payment_id,
          amount_bch: tx.amount_bch,
        }
      : "NOT FOUND",
  );

  let paymentAddress = tx?.payment_id;
  let amountBch = tx?.amount_bch;
  let isTxConfirmed = tx?.status === "confirmed";
  let txId = tx?.id;

  if (!paymentAddress || amountBch == null) {
    console.log(
      `[POLL API] Transaction missing or incomplete. Checking bookings table fallback...`,
    );
    const { data: bookingFallback } = (await supabase
      .from("bookings")
      .select("payment_address, amount_bch, status")
      .eq("id", bookingId)
      .single()) as { data: any };

    if (bookingFallback) {
      paymentAddress = bookingFallback.payment_address;
      amountBch = bookingFallback.amount_bch;
      isTxConfirmed = bookingFallback.status === "confirmed";
      console.log(`[POLL API] Fallback booking data:`, bookingFallback);
    }
  }

  if (!paymentAddress || amountBch == null) {
    console.log(
      `[POLL API] Exiting early: insufficient transaction data in both tables.`,
    );
    return Response.json({ status: "pending" });
  }

  if (isTxConfirmed) {
    console.log(
      `[POLL API] Exiting early: Transaction already confirmed in DB.`,
    );
    return Response.json({ status: "confirmed" });
  }

  console.log(
    `[POLL API] Calling checkAddressReceived for address: ${paymentAddress}, expectedBch: ${amountBch}`,
  );
  const result = await checkAddressReceived(paymentAddress, amountBch);
  console.log(`[POLL API] getAddressReceived result:`, result);

  if (result.status === "confirmed") {
    console.log(`[POLL API] Payment CONFIRMED! Updating database...`);

    if (txId) {
      await supabase
        .from("payment_transactions")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
        })
        .eq("id", txId);
    }

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

    if (booking.conversation_id) {
      const { data: msgs } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", booking.conversation_id)
        .eq("component", "ItineraryCard");

      if (msgs) {
        for (const msg of msgs) {
          const msgData = msg.data as any;
          if (!msgData) continue;

          const msgItineraryId =
            msgData.tripId ??
            `${msgData.destination}-${msgData.startDate}-${msgData.endDate}-${msgData.travelers ?? 1}`;

          // @ts-ignore
          if (msgItineraryId === booking.itinerary_id) {
            await supabase
              .from("messages")
              .update({
                data: {
                  ...msgData,
                  bookedTripId: trip.id,
                },
              })
              .eq("id", msg.id);
          }
        }
      }
    }

    console.log(
      `[POLL API] Successfully finalized trip creation. Returning confirmed status to client.`,
    );
    return Response.json({
      status: "confirmed",
      tripId: trip.id,
      txHash: result.txHash,
      explorerUrl: result.explorerUrl,
    });
  }

  console.log(`[POLL API] Payment STILL PENDING. Returning to client.`);
  return Response.json({
    status: result.status,
    receivedBch: result.receivedBch,
    expectedBch: result.expectedBch,
  });
}
