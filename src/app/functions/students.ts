import { createClient } from "@/lib/supabase/client"
import { Student } from "../students/columns"
export const selectData = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("student_points").select()
  if (!error) {
    console.log(data)
    
    // Sort by last name and format names as "Last, First"
    const sortedData = (data as Student[])
      .map(student => {
        // Split the name to get first and last name
        const nameParts = student.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        return {
          ...student,
          name: lastName ? `${lastName}, ${firstName}` : firstName,
          // Store original name parts for sorting
          _firstName: firstName,
          _lastName: lastName
        };
      })
      .sort((a, b) => {
        // Sort by last name, then by first name
        const lastNameCompare = a._lastName.localeCompare(b._lastName);
        if (lastNameCompare !== 0) return lastNameCompare;
        return a._firstName.localeCompare(b._firstName);
      })
      .map(({ _firstName, _lastName, ...student }) => student); // Remove temp sorting fields
    
    return sortedData as Student[]
  } else {
    console.log(error)
  }
}
export const addPlayer = async ({ name, email, grade }: Student) => {
  const supabase = createClient();
  const month = new Date().getMonth();
  console.log(month);
  let year = new Date().getFullYear();
  if (month >= 7) {
    year + 1;
  }
  const { data, error } = await supabase
    .from("students")
    .insert({
      name,
      email,
      grade,
      grad: year + (12 - grade),
      active: true,
    })
    .select();
  if (!error) {
    return data as Student[];
  } else {
    console.log(error);
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
    return data as Student[];
  } else {
    console.log(error);
  }
};

export const updatePlayer = async ({ id, name, email, grade }: Student) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("players")
    .update({
      name,
      email,
      grade,
      grad: Number(process.env.CURRENT_YEAR) + (12 - grade),
      active: true,
    })
    .eq("id", id)
    .select();
  if (!error) {
    return data as Student[];
  } else {
    console.log(error);
  }
};
