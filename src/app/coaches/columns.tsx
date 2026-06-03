"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export type Coach = {
  coach: string;
};

export const columns = ({
  onToggleLastNameSort,
}: {
  onToggleLastNameSort: () => void;
}): ColumnDef<Coach>[] => [
  {
    id: "rowNumber",
    header: "#",
    cell: ({ row }) => row.index + 1,
  },
  {
    accessorKey: "coach",
    header: () => (
      <div className="flex items-center">
        <Button
          variant="ghost"
          onClick={onToggleLastNameSort}
        >
          Coach
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      </div>
    ),
  },
];
