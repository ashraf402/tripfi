import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { TripDetail } from "@/components/trips/TripDetail";

export default async function TripDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: trip } = await supabase
    .from("trips")
    .select(
      `
      *,
      bookings (
        *,
        payment_transactions (*)
      )
    `,
    )
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single();

  if (!trip) notFound();

  return <TripDetail trip={trip} />;
}
