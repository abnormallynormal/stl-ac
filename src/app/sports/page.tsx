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
import { Plus, Loader2 } from "lucide-react";
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
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        setLoadError("Failed to load sports. Please try again.");
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
    setAddError(null);
    setIsAdding(true);
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
      setAddError("Failed to add sport. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };
  const editOnSubmit = async (values: z.infer<typeof editFormSchema>) => {
    if (sportId === undefined) return;

    setEditError(null);
    setIsSaving(true);
    try {
      await updateData({
        id: sportId,
        name: values.name,
        points: values.points,
      });

      setData((prevData) =>
        prevData.map((team) =>
          team.id === sportId
            ? { ...team, name: values.name, points: values.points }
            : team
        )
      );

      setEditIsOpen(false);

      editForm.reset();
    } catch (error) {
      setEditError("Failed to update sport. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };
  const deleteOnSubmit = async (sportId: number | undefined) => {
    if (sportId === undefined) return;
    setDeleteError(null);
    setIsDeleting(true);
    try {
      await deleteData({
        id: sportId,
      });
      setData((prevData) => prevData.filter((sport) => sport.id !== sportId));
      setDeleteIsOpen(false);
    } catch (error) {
      setDeleteError("Failed to delete sport. Please try again.");
    } finally {
      setIsDeleting(false);
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
                      <Button type="submit" disabled={isAdding}>
                        {isAdding ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Add"
                        )}
                      </Button>
                    </div>
                    {addError && (
                      <p className="text-sm text-destructive">{addError}</p>
                    )}
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
                      <Button type="submit" disabled={isSaving}>
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </div>
                    {editError && (
                      <p className="text-sm text-destructive">{editError}</p>
                    )}
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
                {deleteError && (
                  <p className="text-sm text-destructive">{deleteError}</p>
                )}
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteOnSubmit(sportId)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {loadError && (
            <p className="text-sm text-destructive mb-2">{loadError}</p>
          )}
          <DataTable columns={columns} data={data} isLoading={loading} />
        </div>
      </div>
    </>
  );
}
