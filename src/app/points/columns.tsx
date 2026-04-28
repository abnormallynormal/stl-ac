"use client";

import { ColumnDef } from "@tanstack/react-table";

export type PlayerWithPoints = {
  student_id: number;
  name: string;
  points: number;
  grade: number;
};
export const columns: ColumnDef<PlayerWithPoints>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
];
