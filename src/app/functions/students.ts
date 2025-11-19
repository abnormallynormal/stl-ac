import { createClient } from "@/lib/supabase/client"
import { Student } from "../students/columns"
export const selectData = async () => {
  const supabase = createClient()
  const { data, error } = await supabase.from("student_points").select().range(0, 5000);
  if (!error) {
    console.log(data)
      // Sort by last name and format names as "Last, First"
    const sortedData = (data as Student[])
      .map(student => {        let firstName = '';
        let lastName = '';
        
        // Check if name is already in "Last, First" format
        if (student.name.includes(',')) {
          const parts = student.name.split(',').map(part => part.trim());
          lastName = parts[0] || '';
          firstName = parts[1] || '';
        } else {
          // Names are stored as "Last Name First Name" - find the last space to split
          const trimmedName = student.name.trim();
          const lastSpaceIndex = trimmedName.indexOf(' ');
          
          if (lastSpaceIndex !== -1) {
            lastName = trimmedName.substring(0, lastSpaceIndex);
            firstName = trimmedName.substring(lastSpaceIndex + 1);
          } else {
            // Single name case - treat as first name
            firstName = trimmedName;
            lastName = '';
          }
        }
        
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
      .map(({ _lastName, _firstName, ...student }) => student); // Remove temp sorting fields
    
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
    year += 1;
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
    .select()
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
