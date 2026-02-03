"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Team } from "../teams/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Finance = {
  student_id: number;
  name: string;
  paid_to_team: number | null;
};
export const columns = ({teams}: {teams: Team[]}): ColumnDef<Finance>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "paid_to_team",
    header: "Paid to Team",
    cell: ({row}) => {
      const team = teams.find((team) => team.id === row.original.paid_to_team)
      return (
        <a href={`/teams/${row.original.paid_to_team}`}>
          {team?.grade.charAt(0)}
          {team?.gender.charAt(0)}{" "}
          {team?.sport?.name}
        </a>
      );
    }
  },
];