import { createClient } from "@/lib/supabase/client";
import { TopAthlete } from "@/app/topathletes/columns";

export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("top_athletes")
    .select(
      "id, name, gender, grade, team_count, team, yraa, ofsaa, mvp, lca"
    );
  if (!data) {
    throw new Error(error?.message ?? "Unable to fetch top athletes");
  }
  return data as TopAthlete[];
};

export const insertData = async ({
  name,
  gender,
  grade,
  team_count,
  team,
  yraa,
  ofsaa,
  mvp,
  lca,
}: {
  name: string;
  gender: string;
  grade: number;
  team_count: number;
  team: string;
  yraa: number;
  ofsaa: number;
  mvp: number;
  lca: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("top_athletes")
    .insert({ name, gender, grade, team_count, team, yraa, ofsaa, mvp, lca })
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as TopAthlete[];
  }
};

export const updateData = async ({
  id,
  name,
  gender,
  grade,
  team_count,
  team,
  yraa,
  ofsaa,
  mvp,
  lca,
}: {
  id: number;
  name: string;
  gender: string;
  grade: number;
  team_count: number;
  team: string;
  yraa: number;
  ofsaa: number;
  mvp: number;
  lca: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("top_athletes")
    .update({ name, gender, grade, team_count, team, yraa, ofsaa, mvp, lca })
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as TopAthlete[];
  }
};

export const deleteData = async ({ id }: { id: number }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("top_athletes")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as TopAthlete[];
  }
};
