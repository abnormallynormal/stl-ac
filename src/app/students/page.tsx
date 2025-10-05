import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, columns } from "./columns";
import { DataTable } from "./data-table";
export default function Students(){
  const data: Student[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      grade: 10,
      year: 2023,
    },
    {
      id: "2",
      name: "Jane Doe",
      email: "jane.doe@example.com",
      grade: 11,
      year: 2023,
    },
  ]
  return(
    <div className="px-16 py-24">
      <div className="text-3xl font-bold mb-2">Student List</div>
      <div className="flex gap-4 items-center mb-8">
        <span>Select a year:</span>
        <Select>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}