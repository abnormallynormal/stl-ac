"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Team = {
  id: string;
  sport: string;
  points: number;
};

export const columns: ColumnDef<Team>[] = [
  {
    accessorKey: "sport",
    header: "Sport",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
];
