import { createClient } from "@/lib/supabase/client";
import { Team } from "@/app/sports/columns";
export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("sports").select();
  if (!error) {
    return data as Team[];
  } else {
    console.log(error);
  }
};
export const insertData = async ({
  sport,
  points,
}: {
  sport: string;
  points: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .insert({ sport, points })
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
};
export const updateData = async ({
  id,
  sport,
  points,
}: {
  id: number;
  sport: string;
  points: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .update({ sport, points })
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
};
export const deleteData = async ({ id }: { id: number }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
};
