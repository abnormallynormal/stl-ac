import { createClient } from "@/lib/supabase/client";
import { Player } from "../teams/[id]/columns";
import { Finance } from "../finances/columns";

export async function markAsPaid({
  playerId,
  teamId,
}: {
  playerId: number;
  teamId: number;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("players")
    .update({ paid: true })
    .eq("id", playerId)
    .eq("team_id", teamId);
  const { data: players, error: selectError } = await supabase
    .from("players")
    .select()
    .eq("team_id", teamId);
  if (error) {
    throw new Error(error.message);
  }
  if (selectError) {
    throw new Error(selectError.message);
  }
  console.log(players);
  return (players ?? []) as Player[];
}
export async function markAsUnpaid({
  playerId,
  teamId,
}: {
  playerId: number;
  teamId: number;
}) {
  const supabase = createClient();
  const { error } = await supabase
    .from("players")
    .update({ paid: false })
    .eq("id", playerId)
    .eq("team_id", teamId);
  const { data: players, error: selectError } = await supabase
    .from("players")
    .select()
    .eq("team_id", teamId);
  if (error) {
    throw new Error(error.message);
  }
  if (selectError) {
    throw new Error(selectError.message);
  }
  console.log(players);
  return (players ?? []) as Player[];
}

export async function getFinances() {
  const supabase = createClient();
  const { data, error } = await supabase.from("finances").select();
  if (error) {
    throw new Error(error.message);
  }
  console.log(data);
  const sorted_data = (data as Finance[]).map((finance) => {
    const nameParts = finance.name.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    
  });
  return data as Finance[];
}
