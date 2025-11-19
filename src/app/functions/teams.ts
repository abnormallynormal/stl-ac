import {createClient} from "@/lib/supabase/client";
import { Team } from "../teams/columns";

export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("teams").select();
  if (!error) {
    console.log(data);
    // Sort the data alphabetically by sport, then grade, then gender
    const sortedData = (data as Team[]).sort((a, b) => {
      // First sort by sport
      if (a.sport !== b.sport) {
        return a.sport.localeCompare(b.sport);
      }
      // Then by grade
      if (a.grade !== b.grade) {
        return a.grade.localeCompare(b.grade);
      }
      // Finally by gender
      return a.gender.localeCompare(b.gender);
    });
    return sortedData;
  } else {
    console.log(error);
  }
};
export const selectSports = async () => {
  const supabase = createClient();
  const {data, error} = await supabase.from("sports").select("sport, points");
  if (!error) {
    return data as {sport: string, points: number}[];
  } else {
    console.log(error);
  }
}
export const addSport = async ({
  sport,
  points,
  year,
  season,
  grade,
  gender,
  teachers
}: {
  
  sport: string;
  points: number;
  year: string;
  season: string;
  grade: string;
  gender: string;
  teachers: string[];
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("teams")
    .insert({ sport, grade, gender, season, teachers, points, year})
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
};

export const updateSport = async({
  id,
  sport,
  points,
  year,
  season,
  grade,
  gender,
  teachers,
  seasonHighlights,
  yearbookMessage,
}: {
  id: number;
  sport: string;
  points: number;
  year: string;
  season: string;
  grade: string;
  gender: string;
  teachers: string[];
  seasonHighlights: string;
  yearbookMessage: string;
}) =>{
  const supabase = createClient();
  const {data, error} = await   supabase.from("teams").update({
    sport,
    grade,
    gender,
    season,
    teachers,
    points,
    year,
    seasonHighlights,
    yearbookMessage,
  }).eq("id", id).select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
}

export const deleteSport = async ({ id }: { id: number }) => {
  const supabase = createClient();
  const {data, error} = await supabase.from("teams").delete().eq("id", id).select();
  if (error) {
    console.log(error);
  } else {
    return data as Team[];
  }
}