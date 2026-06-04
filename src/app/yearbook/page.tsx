"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Yearbook } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/teams";
import { Button } from "@/components/ui/button";
import { CURRENT_SCHOOL_YEAR } from "@/lib/constants";
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
          data
            ?.filter((team) => team.year === CURRENT_SCHOOL_YEAR)
            .map((team) => ({
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
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </>
  );
}
