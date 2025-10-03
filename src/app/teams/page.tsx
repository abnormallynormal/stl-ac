"use client";
import { columns, Team } from "./columns";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const formSchema = z.object({
  name: z.string(),
  points: z.number().int().min(0),
});

export default function Teams() {
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      points: 0,
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <div className="px-16 py-24">
      <div className="max-w-4xl justify-self-center w-full">
        <div className="flex mb-4 justify-between">
          <div className="font-bold text-3xl">Sports</div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus /> <span className="hidden sm:block">Add Sport</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Sport</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid grid-rows-2 sm:grid-cols-2 sm:grid-rows-1 gap-4">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                  <div className="flex justify-end">
                    <Button type="submit">Add</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable columns={columns} data={data} />
      </div>
    </div>
  );
}
