"use client";

import { ColumnDef } from "@tanstack/react-table";

export type PreviousWinner = {
  student_id: number;
  name: string;
  points: number;
  year: number;
  award: string;
};
export const columns: ColumnDef<PreviousWinner>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "award",
    header: "Award Won",
  },
  {
    accessorKey: "year",
    header: "Year Won",
  },
{
    accessorKey: "points",
    header: "Current Points",
  },
];