"use client";

import { useState } from "react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { columns, Team } from "./columns";
import { ColumnDef } from "@tanstack/react-table";

export function DataTable({ data, columns }: { data: Team[] ; columns: ColumnDef<Team>[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="px-20 mb-5">
        <table className="w-full border-b border-accent bg-background text-foreground">
        <thead>
            {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                <th key={header.id} className="bg-accent px-4 py-2 border-b text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
                ))}
            </tr>
            ))}
        </thead>
        <tbody>
            {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-accent">
                {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 border-b align-middle whitespace-normal break-words">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
                ))}
            </tr>
            ))}
        </tbody>
        </table>
    </div>
  );
}
