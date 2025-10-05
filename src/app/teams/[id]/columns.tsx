import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
export type Player = {
  id: number;
  name: string;
  grade: number;
  champs: boolean;
  MVP: boolean;
  LDA: boolean;
  paid: boolean;
};

export interface ColumnActions{
  onDelete: (player: Player) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Player>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "champs",
    header: "Champs",
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
        <Button
          variant="link"
          className="text-destructive"
          size="icon"
          onClick={() => {
            actions.onDelete(row.original);
          }}
        >
          <Trash />
        </Button>
      );
    },
  },
];

export const columns = createColumns({
  onDelete: (player) => console.log('Delete player:', player)
})