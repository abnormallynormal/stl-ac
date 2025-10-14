import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { updateRadio, updateCheckbox } from "@/app/functions/team";
export type Player = {
  id: number;
  team_id: number;
  student_id: number;
  name: string;
  email: string;
  grade: number;
  champs: boolean;
  MVP: boolean;
  LDA: boolean;
  paid: boolean;
};

export interface ColumnActions {
  onDelete: (player: Player) => void;
  onUpdateCheckbox: (
    playerId: number,
    field: keyof Player,
    value: boolean
  ) => void;
  onUpdateRadio: (
    playerId: number,
    field: keyof Player,
    value: boolean
  ) => void;
}

export const createColumns = (actions: ColumnActions): ColumnDef<Player>[] => [
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
    accessorKey: "grade",
    header: "Grade",
  },
  {
    accessorKey: "champs",
    header: "Champs",
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.original.champs}
          onCheckedChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateCheckbox(
              row.original.id,
              "champs",
              !row.original.champs
            );
            // Background API call
            updateCheckbox({
              playerId: row.original.id,
              param: "champs",
              value: !row.original.champs,
            });
          }}
        />
      );
    },
  },
  {
    accessorKey: "MVP",
    header: "MVP",
    cell: ({ row }) => {
      return (
        <RadioGroup
          onValueChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateRadio(row.original.id, "MVP", true);
            // Background API call
            updateRadio({
              playerId: row.original.id,
              teamId: row.original.team_id,
              param: "MVP",
              value: true,
            });
          }}
          value={row.original.MVP ? "MVP" : ""}
        >
          <RadioGroupItem value="MVP" />
        </RadioGroup>
      );
    },
  },
  {
    accessorKey: "LDA",
    header: "LDA",
    cell: ({ row }) => {
      return (
        <RadioGroup
          onValueChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateRadio(row.original.id, "LDA", true);
            // Background API call                
            updateRadio({
              teamId: row.original.team_id,
              playerId: row.original.id,
              param: "LDA",
              value: true,
            });
          }}
          value={row.original.LDA ? "LDA" : ""}
        >
          <RadioGroupItem value="LDA" />
        </RadioGroup>
      );
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.original.paid}
          onCheckedChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateCheckbox(
              row.original.id,
              "paid",
              !row.original.paid
            );
            // Background API call
            updateCheckbox({
              playerId: row.original.id,
              param: "paid",
              value: !row.original.paid,
            });
          }}
        />
      );
    },
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
  onDelete: (player) => console.log("Delete player:", player),
  onUpdateCheckbox: (playerId, field, value) =>
    console.log("Update checkbox:", playerId, field, value),
  onUpdateRadio: (playerId, field, value) =>
    console.log("Update radio:", playerId, field, value),
});
