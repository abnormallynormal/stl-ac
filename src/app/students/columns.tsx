"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ellipsis } from "lucide-react";

export type Student = {
  id: number;
  name: string;
  email: string;
  grade: number;
  grad: number;
  active: boolean;
  points: number;
};

export interface ColumnActions{
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Student>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "grade",
    header: "Grade",
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
      const student = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => actions.onEdit(student)}>
              Edit Student
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
              onClick={() => actions.onDelete(student)}
            >
              Delete Student
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  }
];
