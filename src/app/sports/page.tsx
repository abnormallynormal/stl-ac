"use client";
import Navigation from "@/components/navbar";
import {
  selectData,
  updateData,
  insertData,
  deleteData,
} from "../functions/sports";
import { createColumns, Sport } from "./columns";
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
export default function Sports() {
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [sportId, setSportId] = useState<number>();
  const [data, setData] = useState<Sport[]>([]);
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
  const createEditFormSchema = (data: Sport[], currentSportId?: number) =>
    z
      .object({
        name: z.string().min(1, {
          message: "Enter a sport name",
        }),
        points: z.number().int().min(1),
      })
      .superRefine((values, ctx) => {
        const existingSport = data.find((sport) => sport.name === values.name);
        if (existingSport && existingSport.id !== currentSportId) {
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
      if (data.find((sport) => sport.name === values.name)) {
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
  const editFormSchema = createEditFormSchema(data, sportId);
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: data.find((item) => item.id === sportId)?.name || "",
      points: data.find((item) => item.id === sportId)?.points || undefined,
    },
  });
  const addOnSubmit = async (values: z.infer<typeof addFormSchema>) => {
    try {
      await insertData({
        name: values.name,
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
    if (sportId === undefined) return;

    try {
      await updateData({
        id: sportId,
        name: values.name,
        points: values.points,
      });

      // Update local state
      setData((prevData) =>
        prevData.map((team) =>
          team.id === sportId
            ? { ...team, name: values.name, points: values.points }
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
  const deleteOnSubmit = async (sportId: number | undefined) => {
    if (sportId === undefined) return;
    try {
      await deleteData({
        id: sportId,
      });
      // Update local state
      setData((prevData) => prevData.filter((sport) => sport.id !== sportId));
      // Close the dialog
      setDeleteIsOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleEdit = (sport: Sport) => {
    setSportId(sport.id);
    editForm.setValue("name", sport.name);
    editForm.setValue("points", sport.points);
    setEditIsOpen(true);
  };

  const handleDelete = (sport: Sport) => {
    setSportId(sport.id);
    setDeleteIsOpen(true);
  };

  const columns = createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
  });

  if (loading) {
    return (
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex justify-center items-center h-32">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
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
                    {data.find((sport) => sport.id === sportId)?.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteOnSubmit(sportId)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
