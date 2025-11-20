"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Yearbook = {
  team_id: number;
  name: string;
  message: string;
};
export const columns: ColumnDef<Yearbook>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <a href={`/teams/${row.original.team_id}`}>{row.getValue("name")}</a>;
    },
  },
  {
    accessorKey: "message",
    header: "Yearbook Message",
  },
];
