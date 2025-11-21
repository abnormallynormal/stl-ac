"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, PreviousWinner } from "./columns";
import { useEffect, useState } from "react";
import { selectPreviousWinners } from "../../functions/awards";
import { Input } from "@/components/ui/input";
export default function PreviousWinners() {
  const [winners, setWinners] = useState<PreviousWinner[]>();
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    const getPoints = async () => {
      try {
        const data = await selectPreviousWinners();
        if (!data) {
          console.log("Error fetching players");
        }
        setWinners(
          data.map((winner) => {
            const name = winner.student_points.name;
            // Convert "Last First Middle..." to "Last, First Middle..."
            const parts = name.trim().split(" ");
            const formattedName = parts.length >= 2 
              ? `${parts[0]}, ${parts.slice(1).join(" ")}`
              : name;
            
            return {
              student_id: winner.id,
              name: formattedName,
              points: winner.student_points.points,
              year: winner.year,
              award: winner.award,
            };
          })
        );
        
      } catch {
        console.log("Error fetching players");
      }
    };
    getPoints();
  }, []);

  const filteredData = winners?.filter((student) => {
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
        <div className="justify-self-center w-full">
          <div className="font-bold text-3xl mb-4">Previous Award Winners</div>
          <div className="flex items-center gap-4 mb-2">
            <Input
              placeholder="Filter by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        <DataTable columns={columns} data={filteredData ?? []} />
      </div>
    </>
  );
}
