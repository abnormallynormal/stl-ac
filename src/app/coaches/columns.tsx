"use client";
import { ColumnDef } from "@tanstack/react-table";

export type Coach = {
  coach: string;
};

export const columns: ColumnDef<Coach>[] = [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "coach",
    header: "Coach",
  },
];
