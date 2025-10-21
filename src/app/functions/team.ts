import { createClient } from "@/lib/supabase/client";
import { Student } from "../students/columns";
import { Player } from "../teams/[id]/columns";

export const selectablePlayers = async (teamId: number): Promise<Student[]> => {
  const supabase = createClient();
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("student_id")
    .eq("team_id", teamId);

  if (playersError) {
    console.error("Error fetching players:", playersError);
    return [];
  }

  const studentIdsInTeam = players?.map((p: { student_id: number }) => p.student_id) ?? [];

  let query = supabase.from("students").select("*").eq("active", true);

  if (studentIdsInTeam.length > 0) {
    query = query.not("id", "in", `(${studentIdsInTeam.join(",")})`);
  }

  const { data: availableStudents, error: studentsError } = await query;

  if (studentsError) {
    console.error("Error fetching students:", studentsError);
    return [];
  }

  return availableStudents as Student[];
};

export const selectTeamPlayers = async (teamId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .select()
    .eq("team_id", teamId);
  if (!error) {
    return data as Player[];
  } else {
    // console.log(error);
    throw new Error(error.message);
  }
};

export const addPlayer = async ({
  team_id,
  student_id,
  champs,
  mvp,
  lca,
  paid
}: {
  team_id: number;
  student_id: number;
  champs: boolean;
  mvp: boolean;
  lca: boolean;
  paid: boolean;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .insert({ 
      team_id, 
      student_id, 
      champs, 
      mvp, 
      lca, 
      paid 
    })
    .select();
  if (!error) {
    return data as Player[];
  } else {
    // console.log(error);
    throw new Error(error.message);
  }
};

export const deletePlayer = async (playerId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .delete()
    .eq("id", playerId)
    .select();
  if (!error) {
    return data as Player[];
  } else {
    // console.log(error);
    throw new Error(error.message);
  }
};

export const updateCheckbox = async({playerId, param, value}: {playerId: number, param: keyof Player, value: boolean}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .update({ [param]: value })
    .eq("id", playerId)
    .select();
  if (!error) {
    return data as Player[];
  } else {
    // console.log(error);
    throw new Error(error.message);
  }
}

export const updateRadio = async({playerId, teamId, param, value}: {playerId: number, teamId: number, param: keyof Player, value: boolean}) => {
  const supabase = createClient();
  
  const { data: updated, error } = await supabase
    .from("players")
    .update({ [param]: value })
    .eq("id", playerId)
    .select();

  const { data: others, error: othersError } = await supabase
    .from("players")
    .update({ [param]: !value })
    .neq("id", playerId)
    .eq("team_id", teamId)
    .select();

  if (!error && !othersError) {
    return others as Player[];
  }
  if(error){
    // console.log(error ?? othersError);
    throw new Error(error.message);
  }
  if(othersError){
    throw new Error(othersError.message);
  }

}