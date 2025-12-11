"use client";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";
import { markManagerAsPaid, markManagerAsUnpaid } from "@/app/functions/finances";
import { selectData } from "@/app/functions/teams";
import { Finance } from "@/app/finances/columns";

export type Manager = {
  id: number;
  team_id: number;
  student_id: number;
  name: string;
  paid: boolean;
};

export interface ManagerColumnActions {
  onDelete: (manager: Manager) => void;
  reloadData: (data: Manager[]) => void;
  finances: Finance[];
}

const teamsAPI = await selectData();

export const createManagerColumns = ({
  onDelete,
  reloadData,
  finances,
}: ManagerColumnActions): ColumnDef<Manager>[] => {
  return [
    {
      id: "rowNumber",
      header: "#",
      cell: ({ table, row }) => {
        const sorted = table.getSortedRowModel().rows;
        const index = sorted.findIndex(r => r.id === row.id);
        return index + 1;
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "paid",
      header: "Banquet Payment",
      cell: ({ row }) => {
        const manager = row.original;

        // Find finance record for this student
        const finance = finances.find(
          (f) => f.student_id === manager.student_id
        );
        const paidTeamId = finance?.paid_to_team;
        const paidTeam = teamsAPI?.find((team) => team.id === paidTeamId);

        // CASE 1: Manager is paid -> Show “Paid - Mark as unpaid”
        if (manager.paid) {
          return (
            <Button
              className="text-xs h-8 opacity-85"
              onClick={async () => {
                const data = await markManagerAsUnpaid({
                  managerId: manager.id,
                  teamId: manager.team_id,
                });
                reloadData(data);
              }}
            >
              Paid - {paidTeam?.grade.charAt(0)}
              {paidTeam?.gender.charAt(0)} {paidTeam?.sport}
            </Button>
          );
        }

        // CASE 2: Student not paid anywhere -> Show “Mark as paid”
        if (paidTeamId == null) {
          return (
            <Button
              className="text-xs h-8"
              onClick={async () => {
                const data = await markManagerAsPaid({
                  managerId: manager.id,
                  teamId: manager.team_id,
                });
                reloadData(data);
              }}
            >
              Record Payment
            </Button>
          );
        }

        // CASE 3: Paid on another team -> Link to that team’s page
        // if (paidTeamId !== manager.team_id) {
          return (
            <Button className="text-xs h-8 opacity-70" asChild>
              <a>
                Paid - {paidTeam?.grade.charAt(0)}
                {paidTeam?.gender.charAt(0)} {paidTeam?.sport}
              </a>
            </Button>
          );
        // }

        // return null;
      },
    },
    {
      accessorKey: "action",
      header: "",
      cell: ({ row }) => (
        <div className = "flex justify-end pr-2">
          <Button
            variant="link"
            className="text-destructive"
            size="icon"
            onClick={() => onDelete(row.original)}
          >
            <Trash />
          </Button>
        </div>
      ),
    },
  ];
};
