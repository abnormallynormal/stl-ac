"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Awards } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import { selectAllPlayers } from "../functions/team";
export default function AwardsList() {
  const [data, setData] = useState<Awards[]>();
  useEffect(() => {
    const getAwards = async () => {
      try {
        const teams = await selectData();
        console.log(teams)
        if (!data) {
          console.log("Error fetching players");
        }
        const players = await selectAllPlayers();
        console.log(players)
        if (!data) {
          console.log("Error fetching players");
        }
        setData(
          teams?.map((team) => {
            const mvpPlayer = players?.find((player) => player.team_id === team.id && player.mvp);
            const lcaPlayer = players?.find((player) => player.team_id === team.id && player.lca);
            
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
              name: `${team.sport?.name} ${team.grade} ${team.gender}`,
              mvp: formatName(mvpPlayer?.name),
              lca: formatName(lcaPlayer?.name),
            };
          })
        );
      } catch {
        console.log("Error fetching players");
      }
    };
    getAwards();
  }, []);

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="font-bold text-3xl mb-4">MVP and LCA List</div>
        </div>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </>
  );
}
