"use client";
import Navigation from "@/components/navbar";
import AddTeamForm from "@/components/add-team-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Team, columns } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CURRENT_SCHOOL_YEAR, SCHOOL_YEARS } from "@/lib/constants";
export default function TeamList() {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<string>(CURRENT_SCHOOL_YEAR);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const filteredData = data.filter((team) => team.year === selectedYear);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  if (loading) {
    return (
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex justify-center items-center h-32">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="text-3xl font-bold mb-2">Team List</div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4 items-center">
            <span>Select a year:</span>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {SCHOOL_YEARS.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setAddFormOpen(true)}>Add Team</Button>
        </div>
        <DataTable columns={columns} data={filteredData} />
        <Dialog open={addFormOpen} onOpenChange={setAddFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="mb-4">Add Team</DialogTitle>
              <AddTeamForm
                onCancel={() => setAddFormOpen(false)}
                onSuccess={async () => {
                  setAddFormOpen(false);
                  // Refresh the data after successful submission
                  try {
                    const result = await selectData();
                    if (result) {
                      setData(result);
                    }
                  } catch (error) {
                    console.error("Error refreshing data:", error);
                  }
                }}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
