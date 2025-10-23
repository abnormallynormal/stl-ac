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
  yraa: boolean;
  ofsaa: boolean;
  mvp: boolean;
  lca: boolean;
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
  onSelectAll: (
    field: keyof Player
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
    accessorKey: "yraa",
    header: () => {
      return (
        <div className="flex-col ">
          <div>YRAA Champions</div>
          <Button variant="link" size="sm" className="text-xs p-0 h-4" onClick={() => actions.onSelectAll("yraa")}>
            Select All
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.original.yraa}
          onCheckedChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateCheckbox(
              row.original.id,
              "yraa",
              !row.original.yraa
            );
            // Background API call
            updateCheckbox({
              playerId: row.original.id,
              param: "yraa",
              value: !row.original.yraa,
            });
          }}
        />
      );
    },
  },
  {
    accessorKey: "ofsaa",
    header: () => {
      return (
        <div className="flex-col ">
          <div>OFSAA Medalists</div>
          <Button variant="link" size="sm" className="text-xs p-0 h-4" onClick={() => actions.onSelectAll("ofsaa")}>
            Select All
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.original.ofsaa}
          onCheckedChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateCheckbox(
              row.original.id,
              "ofsaa",
              !row.original.ofsaa
            );
            // Background API call
            updateCheckbox({
              playerId: row.original.id,
              param: "ofsaa",
              value: !row.original.ofsaa,
            });
          }}
        />
      );
    },
  },
  {
    accessorKey: "mvp",
    header: "MVP",
    cell: ({ row }) => {
      return (
        <RadioGroup
          onValueChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateRadio(row.original.id, "mvp", true);
            // Background API call
            updateRadio({
              playerId: row.original.id,
              teamId: row.original.team_id,
              param: "mvp",
              value: true,
            });
          }}
          value={row.original.mvp ? "mvp" : ""}
        >
          <RadioGroupItem value="mvp" />
        </RadioGroup>
      );
    },
  },
  {
    accessorKey: "lca",
    header: "LCA",
    cell: ({ row }) => {
      return (
        <RadioGroup
          onValueChange={() => {
            // Optimistic update - update UI immediately
            actions.onUpdateRadio(row.original.id, "lca", true);
            // Background API call
            updateRadio({
              teamId: row.original.team_id,
              playerId: row.original.id,
              param: "lca",
              value: true,
            });
          }}
          value={row.original.lca ? "lca" : ""}
        >
          <RadioGroupItem value="lca" />
        </RadioGroup>
      );
    },
  },
  {
    accessorKey: "paid",
    header: "Banquet Payment",
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
  onSelectAll: (field) => console.log("Select all for field:", field),
});
