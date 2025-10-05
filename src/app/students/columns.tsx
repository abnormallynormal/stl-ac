"use client";

import { ColumnDef } from "@tanstack/react-table";

export type Student = {
  id: string;
  name: string;
  email: string;
  grade: number;
  year: number;
};

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
];
