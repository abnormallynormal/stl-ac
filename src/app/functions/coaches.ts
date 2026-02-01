import { createClient } from "@/lib/supabase/client";
import { Coach } from "@/app/coaches/columns";
import { StringDecoder } from "string_decoder";
export const selectData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.from("coaches").select();
  if (!error) {
    return data as Coach[];
  } else {
    console.log(error);
  }
};
export const insertData = async ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coaches")
    .insert({ name, email })
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Coach[];
  }
};
export const updateData = async ({
  id,
  name,
  email,
}: {
  id: number;
  name: string;
  email: string;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coaches")
    .update({ name, email })
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Coach[];
  }
};
export const deleteData = async ({ id }: { id: number }) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("coaches")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.log(error);
  } else {
    return data as Coach[];
  }
};

