import { createClient } from "@/lib/supabase/client";
import { Coach } from "@/app/coaches/columns";
export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coaches2")
    .select("coach")
    .order("coach", { ascending: true });
  if (!data) {
    throw new Error(error?.message ?? "Unable to fetch coaches");
  }
  return data as Coach[];
};

