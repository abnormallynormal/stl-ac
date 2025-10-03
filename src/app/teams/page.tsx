"use client";
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
import { useState } from "react";
const data: Team[] = [
  {
    id: "badminton",
    sport: "Badminton",
    points: 10,
  },
  {
    id: "baseball",
    sport: "Baseball",
    points: 10,
  },
  {
    id: "basketball",
    sport: "Basketball",
    points: 10,
  },
  {
    id: "cross-country",
    sport: "Cross-Country",
    points: 5,
  },
  {
    id: "curling",
    sport: "Curling",
    points: 10,
  },
  {
    id: "field-hockey",
    sport: "Field Hockey",
    points: 10,
  },
  {
    id: "golf",
    sport: "Golf",
    points: 5,
  },
  {
    id: "hockey",
    sport: "Hockey",
    points: 10,
  },
  {
    id: "rock-climbing",
    sport: "Rock Climbing",
    points: 5,
  },
  {
    id: "rugby-fifteens",
    sport: "Rugby Fifteens",
    points: 10,
  },
  {
    id: "rugby-sevens",
    sport: "Rugby Sevens",
    points: 10,
  },
  {
    id: "slo-pitch",
    sport: "Slo Pitch",
    points: 10,
  },
  {
    id: "soccer",
    sport: "Soccer",
    points: 10,
  },
  {
    id: "swimming",
    sport: "Swimming",
    points: 10,
  },
  {
    id: "table-tennis",
    sport: "Table Tennis",
    points: 5,
  },
  {
    id: "tennis",
    sport: "Tennis",
    points: 5,
  },
  {
    id: "track-and-field",
    sport: "Track and Field",
    points: 10,
  },
  {
    id: "ultimate-frisbee",
    sport: "Ultimate Frisbee",
    points: 10,
  },
  {
    id: "volleyball",
    sport: "Volleyball",
    points: 10,
  },
];
const addFormSchema = z
  .object({
    name: z.string().min(1, {
      message: "Enter a sport name",
    }),
    points: z.number().int().min(0),
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

  const editFormSchema = z
    .object({
      name: z.string().min(1, {
        message: "Enter a sport name",
      }),
      points: z.number().int().min(0),
    });

export default function Teams() {
  const [editIsOpen, setEditIsOpen] = useState(false);
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [teamId, setTeamId] = useState<string>("");
  const addForm = useForm<z.infer<typeof addFormSchema>>({
    resolver: zodResolver(addFormSchema),
    defaultValues: {
      name: "",
      points: 0,
    },
  });
  const editForm = useForm<z.infer<typeof editFormSchema>>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: data.find((item) => item.id === teamId)?.sport || "",
      points: data.find((item) => item.id === teamId)?.points || 0,
    },
  });
  function addOnSubmit(values: z.infer<typeof addFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  function editOnSubmit(values: z.infer<typeof editFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  function deleteOnSubmit(teamId: string) {
    console.log(teamId);
  }

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
                              placeholder="shadcn"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={()=>{setAddIsOpen(false)}}>Cancel</Button>
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
                              placeholder="shadcn"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="secondary" onClick={()=>setEditIsOpen(false)}>Cancel</Button>
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
