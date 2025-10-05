"use client";
import { selectData, updateData, insertData, deleteData } from "../functions/sports";
import { createColumns, Team } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DataTable } from "./data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
export default function Teams() {
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [teamId, setTeamId] = useState<number>();
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const createEditFormSchema = (data: Team[], currentTeamId?: number) =>
    z
      .object({
        name: z.string().min(1, {
          message: "Enter a sport name",
        }),
        points: z.number().int().min(1),
      })
      .superRefine((values, ctx) => {
        const existingTeam = data.find((team) => team.sport === values.name);
        if (existingTeam && existingTeam.id !== currentTeamId) {
          ctx.addIssue({
            code: "custom",
            message: "Sport already exists",
            path: ["name"],
          });
        }
      });
  const addFormSchema = z
    .object({
      name: z.string().min(1, {
        message: "Enter a sport name",
      }),
      points: z.number().int().min(1),
    })
    .superRefine((values, ctx) => {
      if (data.find((team) => team.sport === values.name)) {
        ctx.addIssue({
          code: "custom",
          message: "Sport already exists",
          path: ["name"],
        });
      }
    });

  const addForm = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      name: "",
      points: undefined,
    },
  });
  const editFormSchema = createEditFormSchema(data, teamId);
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: data.find((item) => item.id === teamId)?.sport || "",
      points: data.find((item) => item.id === teamId)?.points || undefined,
    },
  });
  const addOnSubmit = async (values: z.infer<typeof addFormSchema>) => {
    try {
      await insertData({
        sport: values.name,
        points: values.points,
      });
      const result = await selectData();
      if (result) {
        setData(result);
      }

      setAddIsOpen(false);

      addForm.reset();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };
  const editOnSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (teamId === undefined) return;

    try {
      await updateData({
        id: teamId,
        sport: values.name,
        points: values.points,
      });

      // Update local state
      setData((prevData) =>
        prevData.map((team) =>
          team.id === teamId
            ? { ...team, sport: values.name, points: values.points }
            : team
        )
      );

      // Close the dialog
      setEditIsOpen(false);

      // Reset the form
      editForm.reset();
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const deleteOnSubmit = async (teamId: number | undefined) => {
    if (teamId === undefined) return;
    try {
      await deleteData({
        id: teamId,
      });
      // Update local state
      setData((prevData) => prevData.filter((team) => team.id !== teamId));
      // Close the dialog
      setDeleteIsOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleEdit = (team: Team) => {
    setTeamId(team.id);
    editForm.setValue("name", team.sport);
    editForm.setValue("points", team.points);
    setEditIsOpen(true);
  };

  const handleDelete = (team: Team) => {
    setTeamId(team.id);
    setDeleteIsOpen(true);
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (loading) {
    return (
      <div className="px-16 py-24">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex justify-center items-center h-32">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-16 py-24">
      <div className="max-w-4xl justify-self-center w-full">
        <div className="flex mb-4 justify-between">
          <div className="font-bold text-3xl">Sports</div>
          <Dialog open={addIsOpen} onOpenChange={setAddIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> <span className="hidden sm:block">Add Sport</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Sport</DialogTitle>
              </DialogHeader>
              <Form {...addForm}>
                <form
                  onSubmit={addForm.handleSubmit(addOnSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-4">
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sport Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Basketball" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value ?? ""}
                              placeholder="10"
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setAddIsOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={editIsOpen} onOpenChange={setEditIsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Sport</DialogTitle>
              </DialogHeader>
              <Form {...editForm}>
                <form
                  onSubmit={editForm.handleSubmit(editOnSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-4">
                    <FormField
                      control={editForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sport Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Basketball" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="points"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Points</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              value={field.value ?? ""}
                              onChange={(e) =>
                                field.onChange(e.target.valueAsNumber)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setEditIsOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <AlertDialog open={deleteIsOpen} onOpenChange={setDeleteIsOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure you want to delete{" "}
                  {data.find((team) => team.id === teamId)?.sport}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteOnSubmit(teamId)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
