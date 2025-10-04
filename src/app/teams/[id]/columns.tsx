import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis } from "lucide-react";
export type Player = {
  id: number;
  name: string;
  grade: number;
  MVP: boolean;
  LDA: boolean;
  paid: boolean;
};
export const columns: ColumnDef<Player>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "MVP",
    header: "MVP",
  },
  {
    accessorKey: "LDA",
    header: "LDA",
  },
  {
    accessorKey: "paid",
    header: "Paid",
  },
  {
    accessorKey: "action",
    header: () => {
      return null;
    },
    cell: ({ row }) => {
      return (
        <a href={`/teams/${row.original.id}`}>
          <Button
            variant="link"
            size="icon"
            onClick={()=>{
              console.log(row.original)
            }}
          >
            <Ellipsis />
          </Button>
        </a>
      );
    },
  },
];