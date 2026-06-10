import { createClient } from "@/lib/supabase/client";
import { Student } from "../students/columns";
import { Player } from "../teams/[id]/columns";

export const selectablePlayers = async (
  teamId: number,
  search = ""
): Promise<Student[]> => {
  const supabase = createClient();
  const { data: players, error: playersError } = await supabase
    .from("players")
    .select("student_id")
    .eq("team_id", teamId);

  if (playersError) {
    throw new Error(playersError.message);
  }

  const studentIdsInTeam =
    players?.map((p: { student_id: number }) => p.student_id) ?? [];

  let query = supabase.from("students").select("*").eq("active", true);

  if (studentIdsInTeam.length > 0) {
    query = query.not("id", "in", `(${studentIdsInTeam.join(",")})`);
  }

  // Server-side name search so we don't load every student into the client.
  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    query = query.ilike("name", `%${trimmedSearch}%`);
  }

  query = query.order("name", { ascending: true }).limit(50);

  const { data: availableStudents, error: studentsError } = await query;

  if (studentsError) {
    throw new Error(studentsError.message);
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
    throw new Error(error.message);
  }
};

export const selectAllPlayers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .select("*, students(name, email)");
  if(!error){
    return data?.map((player: any) => ({
      ...player,
      name: player.students?.name,
      email: player.students?.email,
    })) as Player[];
  } else {
    throw new Error(error.message);
  }
};

export const addPlayer = async ({
  team_id,
  student_id,
  yraa,
  ofsaa,
  mvp,
  lca,
  paid,
}: {
  team_id: number;
  student_id: number;
  yraa: boolean;
  ofsaa: boolean;
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
      yraa,
      ofsaa,
      mvp,
      lca,
      paid,
    })
    .select();
  if (!error) {
    return data as Player[];
  } else {
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
    throw new Error(error.message);
  }
};

export const updateCheckbox = async ({
  playerId,
  param,
  value,
}: {
  playerId: number;
  param: keyof Player;
  value: boolean;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .update({ [param]: value })
    .eq("id", playerId)
    .select();
  if (!error) {
    return data as Player[];
  } else {
    throw new Error(error.message);
  }
};

export const updateRadio = async ({
  playerId,
  teamId,
  param,
  value,
}: {
  playerId: number;
  teamId: number;
  param: keyof Player;
  value: boolean;
}) => {
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
  if (error) {
    throw new Error(error.message);
  }
  if (othersError) {
    throw new Error(othersError.message);
  }
};

export const selectableManagers = async (
  teamId: number,
  search = ""
): Promise<Student[]> => {
  const supabase = createClient();

  const { data: managers, error: managersError } = await supabase
    .from("managers")
    .select("student_id")
    .eq("team_id", teamId);

  if (managersError) {
    throw new Error(managersError.message);
  }

  const studentIdsInManagers =
    managers?.map((m: { student_id: number }) => m.student_id) ?? [];
  let query = supabase.from("students").select("*").eq("active", true);

  if (studentIdsInManagers.length > 0) {
    query = query.not("id", "in", `(${studentIdsInManagers.join(",")})`);
  }

  // Server-side name search so we don't load every student into the client.
  const trimmedSearch = search.trim();
  if (trimmedSearch) {
    query = query.ilike("name", `%${trimmedSearch}%`);
  }

  query = query.order("name", { ascending: true }).limit(50);

  const { data: availableStudents, error: studentsError } = await query;

  if (studentsError) {
    throw new Error(studentsError.message);
  }

  return availableStudents as Student[];
};

export const selectTeamManagers = async (teamId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("managers")
    .select("*")
    .eq("team_id", teamId);
  if (error) throw error;
  return data;
};

export const addManager = async (manager: {
  team_id: number;
  student_id: number;
  paid: boolean;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("managers")
    .insert(manager)
    .select();

  if (error) {
    throw error;
  }

  return data;
};

export const deleteManager = async (managerId: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("managers")
    .delete()
    .eq("id", managerId);
  if (error) throw error;
};

export const updateManagerPaid = async (managerId: number, value: boolean) => {
  const supabase = createClient();

  // Find which student this manager corresponds to
  const { data: manager, error: managerError } = await supabase
    .from("managers")
    .select("student_id")
    .eq("id", managerId)
    .single();

  if (managerError || !manager) {
    throw managerError;
  }

  // Update this manager's paid field
  const { error: updateError } = await supabase
    .from("managers")
    .update({ paid: value })
    .eq("id", managerId);

  if (updateError) {
    throw updateError;
  }

  // If marked paid, sync to all related player + manager rows for this student
  if (value) {
    await Promise.all([
      supabase
        .from("players")
        .update({ paid: true })
        .eq("student_id", manager.student_id),
      supabase
        .from("managers")
        .update({ paid: true })
        .eq("student_id", manager.student_id),
    ]);
  }
};
