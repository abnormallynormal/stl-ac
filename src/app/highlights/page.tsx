"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Highlights } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
export default function SeasonHighlights() {
  const [data, setData] = useState<Highlights[]>();

  useEffect(() => {
    const getHighlights = async () => {
      try {
        const data = await selectData();
        if (!data) {
          console.log("Error fetching players");
        }
        setData(
          data?.map((team) => ({
            team_id: team.id,
            season: `${team.season}`,
            name: `${team.grade} ${team.gender} ${team.sport}`,
            highlight: team.seasonHighlights
              ? `"${team.seasonHighlights.trim()}"`
              : "⚠️ No message yet ⚠️",
          }))
        );
      } catch {
        console.log("Error fetching players");
      }
    };
    getHighlights();
  }, []);

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="font-bold text-3xl mb-4">Season Highlights</div>
        </div>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </>
  );
}
