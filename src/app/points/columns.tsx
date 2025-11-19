"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Team } from "../teams/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PlayerWithPoints = {
  student_id: number;
  name: string;
  points: number;
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