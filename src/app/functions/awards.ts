import { createClient } from "@/lib/supabase/client";
import { PreviousWinner } from "../points/previous-winners/columns";
export async function selectPreviousWinners(){
  const supabase = createClient();
  const { data, error } = await supabase
    .from("award_winners")
    .select("*, student_points!inner(points, name)");
  if(!data){
    throw new Error(error.message);
  }
  
  return data;
}

export async function addWinner({id, award, year} : {id: number; award: string; year: number}){
  const supabase = createClient();
  const {data , error} = await supabase.from("award_winners").insert({id, award, year}).select("*, student_points!inner(points,name)");
  if(!data){
    throw new Error(error.message);
  }
  return data;
}
export async function updateWinner({
  id,
  award,
  year,
}: {
  id: number;
  award: string;
  year: number;
}) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("award_winners")
    .update({ id, award, year })
    .eq("id", id)
    .select("*, student_points!inner(points,name)");
  if (!data) {
    throw new Error(error.message);
  }
  return data;
}