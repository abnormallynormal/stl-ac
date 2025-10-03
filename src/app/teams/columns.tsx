"use client"
import { ColumnDef } from "@tanstack/react-table";

export type Team = {
  id: string;
  sport: string;
  gender: "Boys" | "Girls" | "Co-ed";
  grade: "Jr." | "Sr." | "Varsity";
  season: "Winter" | "Spring" | "Fall";
  teachers: string[];
  points: number;
};
export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "team",
    header: "Team",
    cell: ({row}) => {
      const team = row.original;
      return ` ${team.sport} ${team.grade} ${team.gender}`;
    }
  },
  {
    accessorKey: "teachers",
    header: "Teachers",
    cell: ({row}) => {
      const team = row.original;
      return team.teachers.join(", ");
    }
  },
  {
    accessorKey: "season",
    header: "Season",
  },
    {
      accessorKey: "action",
      cell: ({row}) => {
        
      }
    }
];