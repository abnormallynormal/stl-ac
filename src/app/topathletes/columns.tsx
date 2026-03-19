"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export type TopAthlete = {
  id: number;
  name: string;
  gender: string;
  grade: number;
  points: number;
  yraa: number;
  ofsaa: number;
  mvp: number;
  lca: number;
};

export const createColumns = (): ColumnDef<TopAthlete>[] => [
  {
    accessorKey: "name",
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
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "yraa",
    header: "YRAA",
    cell: ({ row }) => (row.original.yraa === 0 ? "-" : row.original.yraa),
  },
  {
    accessorKey: "ofsaa",
    header: "OFSAA",
    cell: ({ row }) => (row.original.ofsaa === 0 ? "-" : row.original.ofsaa),
  },
  {
    accessorKey: "mvp",
    header: "MVP",
    cell: ({ row }) => (row.original.mvp === 0 ? "-" : row.original.mvp),
  },
  {
    accessorKey: "lca",
    header: "LCA",
    cell: ({ row }) => (row.original.lca === 0 ? "-" : row.original.lca),
  },
];
