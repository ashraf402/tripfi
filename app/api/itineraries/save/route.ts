import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { itinerary, conversationId } = await req.json();

  // Upsert saved itinerary for this user
  // @ts-ignore - saved_itineraries is not in generated types yet
  const { data, error } = await supabase
    .from("saved_itineraries" as any)
    .upsert(
      {
        user_id: user.id,
        conversation_id: conversationId,
        itinerary_id: itinerary.tripId,
        title: itinerary.title,
        destination: itinerary.destination,
        start_date: itinerary.startDate,
        end_date: itinerary.endDate,
        travelers: itinerary.travelers,
        total_usd: itinerary.totalCostUsd,
        itinerary_data: itinerary,
      },
      {
        onConflict: "itinerary_id",
      },
    )
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  // Persist isSaved = true to the message in the conversation so it survives page reloads
  if (conversationId && itinerary.tripId) {
    const { data: msgs } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .eq("component", "ItineraryCard");

    if (msgs) {
      for (const msg of msgs) {
        const msgData = msg.data as any;
        if (!msgData) continue;
        if (msgData.tripId === itinerary.tripId) {
          await supabase
            .from("messages")
            .update({
              data: {
                ...msgData,
                isSaved: true,
              },
            })
            .eq("id", msg.id);
        }
      }
    }
  }

  return Response.json({ success: true, data });
}
