"use client"
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Finance } from "./columns";
import { useEffect, useState } from "react";
import { getFinances } from "../functions/finances";
import { selectData } from "../functions/teams";
import { Team } from "../teams/columns";

export default function Finances() {
  const [data, setData] = useState<Finance[]>()
  const [teamData, setTeamData] = useState<Team[]>()
  useEffect(() => {
    const getPayments = async () => {
      try{
        const data = await getFinances();
        if(!data){
          console.log("Error fetching finances")
        }
        setData(data)
      } catch {
        console.log("Error fetching finances")
      }
    }
    getPayments();
  }, [])
  useEffect(() => {
    const getTeams = async () => {
      try {
        const data = await selectData();
        if (!data) {
          console.log("Error fetching teams");
        }
        setTeamData(data);
      } catch {
        console.log("Error fetching teams");
      }
    };
    getTeams();
  }, []);
  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex mb-4 justify-between">
            <div className="font-bold text-3xl">Finances</div>
            
          </div>
          <DataTable columns={columns({ teams: teamData ?? [] })} data={data ?? []} />
        </div>
      </div>
    </>
  );
}
