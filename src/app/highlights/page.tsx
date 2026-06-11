"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Highlights } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import { Button } from "@/components/ui/button";
import { useSchoolYear } from "@/lib/school-year-context";
export default function SeasonHighlights() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Highlights[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHighlights = async () => {
      try {
        const data = await selectData();
        setData(
          data
            ?.filter((team) => team.year === selectedYear)
            .map((team) => ({
            team_id: team.id,
            season: `${team.season}`,
            name: `${team.sport?.name} ${team.grade} ${team.gender}`,
            highlight: team.seasonHighlights
              ? `"${team.seasonHighlights.trim()}"`
              : "No message yet",
            }))
        );
      } catch {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getHighlights();
  }, []);

  const copyHighlights = async () => {
    const formatted = (data ?? [])
      .map((entry) => `${entry.name}\n${entry.highlight}`)
      .join("\n\n");
    await navigator.clipboard.writeText(formatted);
  };

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="mb-4 flex items-center gap-3">
            <div className="font-bold text-3xl">Season Highlights</div>
            <Button variant="outline" size="sm" onClick={() => void copyHighlights()}>
              Copy Highlights
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DataTable columns={columns} data={data ?? []} isLoading={loading} />
      </div>
    </>
  );
}
