"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";

export type Team = {
  id: string;
  sport: string;
  points: number;
};

export interface ColumnActions {
  onEdit: (team: Team) => void;
  onDelete: (team: Team) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Team>[] => [
  {
    accessorKey: "sport",
    header: "Sport",
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "actions",
    header: () => {
      return null;
    },
    cell: ({ row }) => {
      const team = row.original;
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.onEdit(team)}>
              Edit Sport
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => actions.onDelete(team)}
            >
              Delete Sport
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];

// Backward compatibility - you can remove this if you update all usages
export const columns = createColumns({
  onEdit: (team) => console.log('Edit team:', team),
  onDelete: (team) => console.log('Delete team:', team)
});
