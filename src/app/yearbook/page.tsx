"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Yearbook } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import SeasonHighlights from "../highlights/page";
export default function YearbookMessages() {
  const [data, setData] = useState<Yearbook[]>();
  useEffect(() => {
    const getYearbookMessages = async () => {
      try {
        const data = await selectData();
        if (!data) {
          console.log("Error fetching players");
        }
        setData(
          data?.map((team) => ({
            team_id: team.id,
            season: `${team.season}`,
            name: `${team.sport?.name} ${team.grade} ${team.gender}`,
            message: team.yearbookMessage
              ? `"${team.yearbookMessage.trim()}"`
              : "⚠️ No message yet ⚠️",
          }))
        );
      } catch {
        console.log("Error fetching players");
      }
    };
    getYearbookMessages();
  }, []);

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="font-bold text-3xl mb-4">Yearbook Messages</div>
        </div>
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </>
  );
}
