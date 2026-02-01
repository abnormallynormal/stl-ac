"use client"
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, ArrowUpDown } from "lucide-react";
export type Team = {
  id: number;
  sport_id: number;
  sport?: {
    id: number;
    name: string;
    points: number;
  };
  team_coaches?: {
    coaches: {
      id: number;
      email: string;
      name: string;
    };
  }[];
  gender: "Boys" | "Girls" | "Co-ed";
  grade: "Jr." | "Sr." | "Varsity";
  season: "Winter" | "Spring" | "Fall";
  teachers: string[];
  points: number;
  year: string;
  seasonHighlights?: string;
  yearbookMessage?: string;
};
export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "team",
    header: "Team",
    cell: ({ row }) => {
      const team = row.original;
      return (
        <a href={`/teams/${team.id}`}>
          {`${team.sport?.name} ${team.grade} ${team.gender}`}
        </a>
      );
    },

  },
  {
    accessorKey: "teachers",
    header: "Teachers",
    cell: ({ row }) => {
      const team = row.original;
      return team.team_coaches?.map(tc => tc.coaches.email).join(", ") ?? "";
    },
  },
  {
    accessorKey: "season",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Season
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const seasonOrder = { Fall: 0, Winter: 1, Spring: 2 };
      const seasonA =
        seasonOrder[rowA.original.season as keyof typeof seasonOrder];
      const seasonB =
        seasonOrder[rowB.original.season as keyof typeof seasonOrder];
      return seasonA - seasonB;
    },
  },
  {
    accessorKey: "action",
    header: () => {
      return null;
    },
    cell: ({ row }) => {
      return (
        <a href={`/teams/${row.original.id}`}>
          <Button
            variant="link"
            size="icon"
            onClick={() => {
            }}
          >
            <Pencil />
          </Button>
        </a>
      );
    },
  },
];