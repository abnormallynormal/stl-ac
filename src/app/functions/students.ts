import { createClient } from "@/lib/supabase/client"
import { Student } from "../students/columns"
export const selectData = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("students").select()
  if (!error) {
    console.log(data)
    return data as Student[]
  } else {
    console.log(error)
  }
}