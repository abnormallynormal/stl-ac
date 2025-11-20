"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Awards = {
  team_id: number;
  name: string;
  mvp: string;
  lca: string;
};
export const columns: ColumnDef<Awards>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <a href={`/teams/${row.original.team_id}`}>{row.getValue("name")}</a>;
    },
  },
  {
    accessorKey: "mvp",
    header: "MVP",
  },
  {
    accessorKey: "lca",
    header: "LCA",
  },
];
