"use client";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student, columns } from "./columns";
import { DataTable } from "./data-table";
import { selectData } from "@/app/functions/students";
import { useState, useEffect } from "react";
export default function Students() {
  const [data, setData] = useState<Student[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try{
        const result = await selectData();
        if (result) {
          setData(result);
        } else {
          setData([]);
        }
      } catch (error) {
        console.log(error)
      }
    }
    loadData();
  }, []);
  return (
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
  );
}
