import { createClient } from "@/lib/supabase/client";
import { Sport } from "@/app/sports/columns";
export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("sports").select().order('name', { ascending: true });
  if (!error) {
    return data as Sport[];
  }
};
export const insertData = async ({
  name,
  points,
}: {
  name: string;
  points: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .insert({ name, points })
    .select();
  if (!error) {
    return data as Sport[];
  }
};
export const updateData = async ({
  id,
  name,
  points,
}: {
  id: number;
  name: string;
  points: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .update({ name, points })
    .eq("id", id)
    .select();
  await supabase.from("teams").update({ name, points }).eq("sport_id", id);
  if (!error) {
    return data as Sport[];
  }
};
export const deleteData = async ({ id }: { id: number }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .delete()
    .eq("id", id)
    .select();
  if (!error) {
    return data as Sport[];
  }
};
