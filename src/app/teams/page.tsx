"use client";
import Navigation from "@/components/navbar";
import AddTeamForm from "@/components/add-team-form";
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
import { useSchoolYear } from "@/lib/school-year-context";
export default function TeamList() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const filteredData = data.filter((team) => team.year === selectedYear);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        }
      } catch {
        setError("Failed to load teams. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-3xl font-bold">Team List</div>
          <Button onClick={() => setAddFormOpen(true)}>Add Team</Button>
        </div>
        {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
        <DataTable columns={columns} data={filteredData} isLoading={loading} />
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
                  } catch {
                    setError("Failed to refresh teams. Please refresh the page.");
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
