"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Yearbook } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import { Button } from "@/components/ui/button";
import { useSchoolYear } from "@/lib/school-year-context";
export default function YearbookMessages() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Yearbook[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getYearbookMessages = async () => {
      try {
        const data = await selectData();
        setData(
          data
            ?.filter((team) => team.year === selectedYear)
            .map((team) => ({
            team_id: team.id,
            season: `${team.season}`,
            name: `${team.sport?.name} ${team.grade} ${team.gender}`,
            message: team.yearbookMessage
              ? `"${team.yearbookMessage.trim()}"`
              : "No message yet",
            }))
        );
      } catch {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getYearbookMessages();
  }, []);
  
  const copyMessages = async () => {
    const formatted = (data ?? [])
      .map((entry) => `${entry.name}\n${entry.message}`)
      .join("\n\n");
    await navigator.clipboard.writeText(formatted);
  };

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="mb-4 flex flex-row items-center gap-3 whitespace-nowrap">
            <div className="font-bold text-3xl">Yearbook Messages</div>
            <Button variant="outline" size="sm" onClick={() => void copyMessages()}>
                Copy Messages
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DataTable columns={columns} data={data ?? []} isLoading={loading} />
      </div>
    </>
  );
}
