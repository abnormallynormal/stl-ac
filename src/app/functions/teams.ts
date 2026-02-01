import { createClient } from "@/lib/supabase/client";
import { Team } from "../teams/columns";

export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("teams").select(`
      *,
      sport:sports!sport_id (id, name, points),
      team_coaches (
        coaches (id, email, name)
      )
    `);
  if (!error) {
    console.log(data);
    // Sort the data alphabetically by sport, then grade, then gender
    const sortedData = (data as Team[]).sort((a, b) => {
      // First sort by sport
      if ((a.sport?.name || "") !== (b.sport?.name || "")) {
        return (a.sport?.name || "").localeCompare(b.sport?.name || "");
      }
      // Then by grade
      if (a.grade !== b.grade) {
        return a.grade.localeCompare(b.grade);
      }
      // Finally by gender
      return a.gender.localeCompare(b.gender);
    });
    return sortedData as Team[];
  } else {
    console.log(error);
  }
};

export const selectSports = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sports")
    .select("id, name, points");
  if (!error) {
    return data as { id: number; name: string; points: number }[];
  } else {
    console.log(error);
  }
};

export const addTeam = async ({
  sport,
  year,
  season,
  grade,
  gender,
  teachers,
}: {
  sport: string;
  year: string;
  season: string;
  grade: string;
  gender: string;
  teachers: string[]; // array of coach emails
}) => {
  const supabase = createClient();

  // Step 1: Get the sport_id from the sports table
  const { data: sportData, error: sportError } = await supabase
    .from("sports")
    .select("id, points")
    .eq("sport", sport)
    .single();

  if (sportError || !sportData) {
    console.log("Sport not found:", sportError);
    return;
  }

  // Step 2: Insert the team with sport_id
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .insert({
      sport,
      grade,
      gender,
      season,
      points: sportData.points, // Get points from sport
      year,
      sport_id: sportData.id,
    })
    .select()
    .single();

  if (teamError || !teamData) {
    console.log("Team creation error:", teamError);
    return;
  }

  // Step 3: Get coach IDs from emails
  const { data: coachData, error: coachError } = await supabase
    .from("coaches")
    .select("id, email")
    .in("email", teachers);

  if (coachError) {
    console.log("Coach lookup error:", coachError);
    return;
  }

  // Step 4: Insert into team_coaches junction table
  if (coachData && coachData.length > 0) {
    const teamCoachInserts = coachData.map((coach) => ({
      team_id: teamData.id,
      coach_id: coach.id,
    }));

    const { error: junctionError } = await supabase
      .from("team_coaches")
      .insert(teamCoachInserts);

    if (junctionError) {
      console.log("Team-coach assignment error:", junctionError);
      return;
    }
  }

  return [teamData] as Team[];
};

export const updateTeam = async ({
  id,
  sport_id,
  year,
  season,
  grade,
  gender,
  teachers,
  seasonHighlights,
  yearbookMessage,
}: {
  id: number;
  sport_id: number;
  year: string;
  season: string;
  grade: string;
  gender: string;
  teachers: string[]; // array of coach emails
  seasonHighlights: string;
  yearbookMessage: string;
}) => {
  const supabase = createClient();

  // Step 1: Update the team basic info
  const { data: teamData, error: teamError } = await supabase
    .from("teams")
    .update({
      sport_id,
      grade,
      gender,
      season,
      year,
      seasonHighlights,
      yearbookMessage,
    })
    .eq("id", id)
    .select()
    .single();

  if (teamError) {
    console.log("Team update error:", teamError);
    return;
  }

  // Step 2: Delete existing coach assignments
  const { error: deleteError } = await supabase
    .from("team_coaches")
    .delete()
    .eq("team_id", id);

  if (deleteError) {
    console.log("Delete coaches error:", deleteError);
    return;
  }

  // Step 3: Get coach IDs from emails
  const { data: coachData, error: coachError } = await supabase
    .from("coaches")
    .select("id, email")
    .in("email", teachers);

  if (coachError) {
    console.log("Coach lookup error:", coachError);
    return;
  }

  // Step 4: Insert new coach assignments
  if (coachData && coachData.length > 0) {
    const teamCoachInserts = coachData.map((coach) => ({
      team_id: id,
      coach_id: coach.id,
    }));

    const { error: junctionError } = await supabase
      .from("team_coaches")
      .insert(teamCoachInserts);

    if (junctionError) {
      console.log("Team-coach assignment error:", junctionError);
      return;
    }
  }

  return [teamData] as Team[];
};

export const deleteTeam = async ({ id }: { id: number }) => {
  const supabase = createClient();
  // The team_coaches entries will be deleted automatically due to ON DELETE CASCADE
  const { data, error } = await supabase
    .from("teams")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
};
