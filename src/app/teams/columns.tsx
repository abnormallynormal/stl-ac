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

export const columns: ColumnDef<Team>[] = [
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
    header:()=>{
      return null;
    },
    cell: ()=>{
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis/>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Sport</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete Sport</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
