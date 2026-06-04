"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Team } from "../teams/columns";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Finance = {
  student_id: number;
  name: string;
  email?: string | null;
  paid_to_team: number | null;
  year: string;
};
export const columns = ({
  teams,
  onCopyNames,
}: {
  teams: Team[];
  onCopyNames: () => void;
}): ColumnDef<Finance>[] => [
  {
    accessorKey: "name",
    header: () => (
      <div className="flex items-center gap-4">
        <span>Name</span>
        <Button
          variant="outline"
          size="sm"
          className="text-black hover:text-black"
          onClick={onCopyNames}
        >
          Copy Names
        </Button>
      </div>
    ),
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
