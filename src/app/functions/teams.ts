import {createClient} from "@/lib/supabase/client";
import { Team } from "../teams/columns";
export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("teams").select();
  if (!error) {
    console.log(data);
    return data as Team[];
  } else {
    console.log(error);
  }
};
export const selectSports = async () => {
  const supabase = createClient();
  const {data, error} = await supabase.from("sports").select("sport");
  if (!error) {
    console.log(data);
    return data as {sport: string}[];
  } else {
    console.log(error);
  }
}