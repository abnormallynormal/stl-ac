"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";

export type Team = {
  id: number;
  sport: string;
  gender: "Boys" | "Girls" | "Co-ed";
  grade: "Jr." | "Sr." | "Varsity";
  season: "Winter" | "Spring" | "Fall";
  teachers: string[];
  points: number;
  year: string;
  seasonHighlights?: string;
  yearbookMessage?: string;
};

export const columns = (
  toggleTeam: (team: Team) => void,
  selectedTeams: Team[],
  setSelectedTeams: (teams: Team[]) => void,
  allTeams: Team[]
): ColumnDef<Team>[] => [
  {
    accessorKey: "sport",
    header: "Team Name",
    cell: ({ row }) => (
      <span>
        {row.original.sport +
          " " +
          row.original.grade +
          " " +
          row.original.gender}
      </span>
    ),
  },
  {
    accessorKey: "teachers",
    header: "Emails",
    cell: ({ row }) => (
      <div className="w-[900px] truncate whitespace-normal break-words">
        {row.original.teachers.join(", ")}
      </div>
    ),
  },
  //   {
  //     accessorKey: "season",
  //     header: "Season",
  //     cell: ({row}) => <span>{row.original.season}</span>,
  //   },
  {
    id: "select",
    header: ({ table }) => {
      const allSelected = table
        .getRowModel()
        .rows.every((row) =>
          selectedTeams.includes(row.original)
        );

      return (
        <div className="flex items-center justify-end gap-3 text-right pr-4">
          <span>Check All:</span>
          <Checkbox
            checked={allSelected}
            onCheckedChange={() => {
              const ids = table
                .getRowModel()
                .rows.map((row) => row.original.id.toString());
              if (allSelected) {
                // Uncheck all
                setSelectedTeams([])
              } else {
                // Check all
                setSelectedTeams([...allTeams]);
              }
            }}
            className="h-4 w-4 accent-blue-500"
            title="Select All"
          />
        </div>
      );
    },
    cell: ({ row }) => {
      const id = row.original;
      return (
        <div className="flex justify-end pr-4">
          <Checkbox
            checked={selectedTeams.includes(id)}
            onCheckedChange={() => toggleTeam(id)}
            className="h-4 w-4 accent-blue-500"
          />
        </div>
      );
    },
  },
];
