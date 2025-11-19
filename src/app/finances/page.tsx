"use client"
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Finance } from "./columns";
import { useEffect, useState } from "react";
import { getFinances } from "../functions/finances";
import { selectData } from "../functions/teams";
import { Team } from "../teams/columns";
import { Input } from "@/components/ui/input";

export default function Finances() {
  const [data, setData] = useState<Finance[]>()
  const [teamData, setTeamData] = useState<Team[]>()
  const [filter, setFilter] = useState<string>("");
  const [filterTeam, setFilterTeam] = useState<string>();
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
  const filteredData = data?.filter((student) => {
    // Filter by name - check both "Last, First" and "First Last" formats
    const filterLower = filter.toLowerCase();
    const nameLower = student.name.toLowerCase();

    // Check original format (e.g., "Doe, John")
    const originalMatch = nameLower.includes(filterLower);
    const noComma = nameLower.replace(",", "").includes(filterLower);
    // Check reversed format (e.g., "John Doe" when name is stored as "Doe, John")
    const nameParts = nameLower.split(", ");
    const reversedName =
      nameParts.length === 2 ? `${nameParts[1]} ${nameParts[0]}` : nameLower;
    const reversedMatch = reversedName.includes(filterLower);

    const nameMatch = originalMatch || reversedMatch || noComma;

    // Filter by grade if any grade filters are selected
    return nameMatch;
  });
  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="mb-2 justify-between">
            <div className="font-bold text-3xl mb-4">Finances</div>
            <div className="flex items-center">
              <Input
                placeholder="Filter by name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          <DataTable
            columns={columns({ teams: teamData ?? [] })}
            data={filteredData ?? []}
          />
        </div>
      </div>
    </>
  );
}
