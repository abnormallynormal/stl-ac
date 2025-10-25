import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash } from "lucide-react";
import { RadioGroupItem, RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { updateRadio, updateCheckbox } from "@/app/functions/team";
import { markAsPaid, markAsUnpaid } from "@/app/functions/finances";
import { Finance } from "@/app/finances/columns";
import { selectData } from "@/app/functions/teams";
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
  onSelectAll: (field: keyof Player) => void;
}
const teamsAPI = await selectData();

export const createColumns = ({
  actions,
  reloadData,
  finances,
}: {
  actions: ColumnActions;
  reloadData: (data: Player[]) => void;
  finances: Finance[];
}): ColumnDef<Player>[] => {
  return [
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
            <Button
              variant="link"
              size="sm"
              className="text-xs p-0 h-4"
              onClick={() => actions.onSelectAll("yraa")}
            >
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
            <Button
              variant="link"
              size="sm"
              className="text-xs p-0 h-4"
              onClick={() => actions.onSelectAll("ofsaa")}
            >
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
        // Compute finance record and paid team once
        const finance = finances.find(
          (f) => f.student_id === row.original.student_id
        );
        const paidTeamId = finance?.paid_to_team;
        const paidTeam = teamsAPI?.find((team) => team.id === paidTeamId);

        if (row.original.paid) {
          return (
            <Button
              className="text-xs h-8"
              onClick={async () => {
                const data = await markAsUnpaid({
                  playerId: row.original.id,
                  teamId: row.original.team_id,
                });
                reloadData(data);
              }}
            >
              Paid - Mark as unpaid
            </Button>
          );
        }

        // If finance has no paid_to_team (null/undefined), allow marking as paid
        if (paidTeamId == null) {
          return (
            <Button
              className="text-xs h-8"
              onClick={async () => {
                const data = await markAsPaid({
                  playerId: row.original.id,
                  teamId: row.original.team_id,
                });
                reloadData(data);
              }}
            >
              Mark as paid
            </Button>
          );
        }

        // Avoid transient state: if this row is currently unpaid but finance still
        // points to this team momentarily, prefer showing the actionable CTA
        if (paidTeamId === row.original.team_id) {
          return (
            <Button
              className="text-xs h-8"
              onClick={async () => {
                const data = await markAsPaid({
                  playerId: row.original.id,
                  teamId: row.original.team_id,
                });
                reloadData(data);
              }}
            >
              Mark as paid
            </Button>
          );
        }

        return (
          <Button className="text-xs h-8 opacity-70" asChild>
            <a href={`/teams/${paidTeam?.id}`}>
              Paid - {paidTeam?.grade.charAt(0)}
              {paidTeam?.gender.charAt(0)} {paidTeam?.sport}
            </a>
          </Button>
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
};
