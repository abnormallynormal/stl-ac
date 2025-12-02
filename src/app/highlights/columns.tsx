"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Highlights = {
  team_id: number;
  season: string;
  name: string;
  highlight: string;
};
const seasonOrder: Record<string, number> = {
  Fall: 1,
  Winter: 2,
  Spring: 3,
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
    accessorKey: "season",
    header: "Season",
    sortingFn: (rowA, rowB) => {
      const a = seasonOrder[rowA.original.season] ?? 99;
      const b = seasonOrder[rowB.original.season] ?? 99;
      return a - b;
    },
  },
  {
    accessorKey: "highlight",
    header: "Highlight",
  },
];
