"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type TopAthlete = {
  id: number;
  name: string;
  gender: string;
  grade: number;
  team_count: number;
  team: string;
  yraa: number;
  ofsaa: number;
  mvp: number;
  lca: number;
};

export const createColumns = (): ColumnDef<TopAthlete>[] => [
  {
    accessorKey: "name",
    meta: { className: "w-[35%]" },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "team",
    meta: { className: "w-[65%]" },
    header: "Team",
  },
];
