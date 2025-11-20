"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Highlights = {
  team_id: number;
  name: string;
  highlight: string;
};
export const columns: ColumnDef<Highlights>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <a href={`/teams/${row.original.team_id}`}>{row.getValue("name")}</a>;
    },
  },
  {
    accessorKey: "highlight",
    header: "Highlight",
  },
];
