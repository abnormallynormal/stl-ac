"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Awards } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import { selectAllPlayers } from "../functions/team";
import { Button } from "@/components/ui/button";
import { useSchoolYear } from "@/lib/school-year-context";
export default function AwardsList() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Awards[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const getAwards = async () => {
      try {
        const [teams, players] = await Promise.all([
          selectData(),
          selectAllPlayers(),
        ]);
        setData(
          teams
            ?.filter((team) => team.year === selectedYear)
            .map((team) => {
              const mvpPlayer = players?.find(
                (player) => player.team_id === team.id && player.mvp
              );
              const lcaPlayer = players?.find(
                (player) => player.team_id === team.id && player.lca
              );

              // Convert "Last First Middle..." to "First Middle... Last"
              const formatName = (name: string | undefined) => {
                if (!name) return "No selection yet";
                const parts = name.trim().split(" ");
                if (parts.length < 2) return name;
                const [lastName, ...firstNames] = parts;
                return `${firstNames.join(" ")} ${lastName}`;
              };

              return {
                team_id: team.id,
                season: `${team.season}`,
                team: `${team.sport?.name} ${team.grade} ${team.gender}`,
                coaches:
                  team.team_coaches2?.map((coach) => coach.coach).join("\n") ||
                  "No coach assigned",
                mvp: formatName(mvpPlayer?.name),
                lca: formatName(lcaPlayer?.name),
              };
            })
        );
      } catch {
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    getAwards();
  }, []);

  const seasonOrder: Record<string, number> = {
  Fall: 1,
  Winter: 2,
  Spring: 3,
};

const copyAwards = async () => {
  const sorted = [...(data ?? [])].sort((a, b) => {
    const seasonDiff = (seasonOrder[a.season] ?? 99) - (seasonOrder[b.season] ?? 99);
    if (seasonDiff !== 0) return seasonDiff;
    return a.team.localeCompare(b.team);
  });

  const header = ["Team", "Coaches", "Season", "LCA", "MVP"].join("\t");

  const formatted = [header, ...sorted.map((entry) => {
    const coaches = entry.coaches
      .split("\n")
      .map((coach) => coach.trim())
      .filter(Boolean)
      .join(",");

    return [entry.team, coaches, entry.season, entry.lca, entry.mvp].join("\t");
  })].join("\n");

  await navigator.clipboard.writeText(formatted);
};

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="mb-4 flex flex-row items-center gap-3 whitespace-nowrap">
            <div className="font-bold text-3xl">MVP and LCA List</div>
            <Button variant="outline" size="sm" onClick={() => void copyAwards()}>
              Copy Awards
            </Button>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DataTable columns={columns} data={data ?? []} isLoading={loading} />
      </div>
    </>
  );
}
