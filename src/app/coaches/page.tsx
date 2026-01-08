"use client";
import Navigation from "@/components/navbar";
import {
  selectData,
  updateData,
  insertData,
  deleteData,
} from "../functions/coaches";
import { createColumns, Coach } from "./columns";
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
export default function Coaches() {
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [coachId, setCoachId] = useState<number>();
  const [data, setData] = useState<Coach[]>([]);
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
  const createEditFormSchema = (data: Coach[], currentCoachId?: number) =>
    z
      .object({
        name: z.string().min(1, {
          message: "Enter a name",
        }),
        email: z.string().email({
          message: "Enter a valid email address",
        }),
      })
      .superRefine((values, ctx) => {
        const existingCoach = data.find(
          (coach) => coach.email === values.email
        );
        if (existingCoach && existingCoach.id !== currentCoachId) {
          ctx.addIssue({
            code: "custom",
            message: "Coach already exists",
            path: ["email"],
          });
        }
      });
  const addFormSchema = z
    .object({
      name: z.string().min(1, {
        message: "Enter a sport name",
      }),
      email: z.string().email({
        message: "Enter a valid email address",
      }),
    })
    .superRefine((values, ctx) => {
      if (data.find((coach) => coach.email === values.email)) {
        ctx.addIssue({
          code: "custom",
          message: "Coach already exists",
          path: ["email"],
        });
      }
    });

  const addForm = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });
  const editFormSchema = createEditFormSchema(data, coachId);
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: data.find((item) => item.id === coachId)?.name || "",
      email: data.find((item) => item.id === coachId)?.email || "",
    },
  });
  const addOnSubmit = async (values: z.infer<typeof addFormSchema>) => {
    try {
      await insertData({
        name: values.name,
        email: values.email,
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
    if (coachId === undefined) return;

    try {
      await updateData({
        id: coachId,
        name: values.name,
        email: values.email,
      });

      // Update local state
      setData((prevData) =>
        prevData.map((coach) =>
          coach.id === coachId
            ? { ...coach, name: values.name, email: values.email }
            : coach
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
  const deleteOnSubmit = async (coachId: number | undefined) => {
    if (coachId === undefined) return;
    try {
      await deleteData({
        id: coachId,
      });
      // Update local state
      setData((prevData) => prevData.filter((coach) => coach.id !== coachId));
      // Close the dialog
      setDeleteIsOpen(false);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };
  const handleEdit = (coach: Coach) => {
    setCoachId(coach.id);
    editForm.setValue("name", coach.name);
    editForm.setValue("email", coach.email);
    setEditIsOpen(true);
  };

  const handleDelete = (coach: Coach) => {
    setCoachId(coach.id);
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
            <div className="font-bold text-3xl">Coaches</div>
            <Dialog open={addIsOpen} onOpenChange={setAddIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus /> <span className="hidden sm:block">Add Coach</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Coach</DialogTitle>
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={addForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@ycdsb.ca" />
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
                  <DialogTitle>Edit Coach</DialogTitle>
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={editForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@ycdsb.ca" />
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
                    {data.find((coach) => coach.id === coachId)?.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteOnSubmit(coachId)}>
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
