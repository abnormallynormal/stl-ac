"use client"
import { Team } from "../columns";
import { Player, columns } from "./columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, use } from "react";
import { Button } from "@/components/ui/button";
const editSportSchema = z.object({
  sport: z.string().min(1, "Sport is required"),
  gender: z.string().min(1, "Gender is required"),
  grade: z.string().min(1, "Grade is required"),
  season: z.string().min(1, "Season is required"),
  year: z.string().min(1, "Year is required"),
  teachers: z.array(z.email("Invalid email address")).min(1, "At least one teacher is required"),
  points: z.number().int().min(0, "Points must be a non-negative integer"),
  seasonHighlights: z.string().optional(),
  yearbookMessage: z.string().optional(),
});
export default function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const data: Team[] = [
    {
      id: 1,
      sport: "Badminton",
      gender: "Co-ed",
      grade: "Jr.",
      season: "Winter",
      teachers: ["martin.nicholls@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 2,
      sport: "Badminton",
      gender: "Co-ed",
      grade: "Sr.",
      season: "Winter",
      teachers: ["richard.ow@ycdsbk12.ca", "tiziana.hayhoe@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 3,
      sport: "Baseball",
      gender: "Boys",
      grade: "Varsity",
      season: "Spring",
      teachers: ["michael.morrison@ycdsbk12.ca", "domenico.coccia@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 4,
      sport: "Basketball",
      gender: "Boys",
      grade: "Jr.",
      season: "Winter",
      teachers: [
        "jordan.caruso@ycdsbk12.ca",
        "adam.dandrea@ycdsbk12.ca",
        "anthony.petrone@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 5,
      sport: "Basketball",
      gender: "Boys",
      grade: "Sr.",
      season: "Fall",
      teachers: [
        "alexander.dasilva@ycdsbk12.ca",
        "michele.petrone@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 6,
      sport: "Basketball",
      gender: "Girls",
      grade: "Jr.",
      season: "Fall",
      teachers: ["brian.villavazera@ycdsbk12.ca", "david.beck@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 7,
      sport: "Basketball",
      gender: "Girls",
      grade: "Sr.",
      season: "Fall",
      teachers: [
        "alexander.dasilva@ycdsbk12.ca",
        "daniela.bonello@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 8,
      sport: "Cross-Country",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Fall",
      teachers: [
        "jennifer.hickey@ycdsbk12.ca",
        "sabrina.buffa@ycdsbk12.ca",
        "paola.amoroso@ycdsbk12.ca",
      ],
      points: 5,
      year: "2025-26",
    },
    {
      id: 9,
      sport: "Curling",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Winter",
      teachers: [
        "alexandra.carvier@ycdsbk12.ca",
        "michael.onorati@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 10,
      sport: "Golf",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Fall",
      teachers: ["tiziana.hayhoe@ycdsbk12.ca", "martin.nicholls@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 11,
      sport: "Hockey",
      gender: "Boys",
      grade: "Varsity",
      season: "Winter",
      teachers: [
        "dan.nero@ycdsbk12.ca",
        "mark.johnson@ycdsbk12.ca",
        "michael.morrison@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 12,
      sport: "Hockey",
      gender: "Girls",
      grade: "Varsity",
      season: "Winter",
      teachers: [
        "michael.stevan@ycdsbk12.ca",
        "michael.merlocco@ycdsbk12.ca",
        "rocky.savoia@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 13,
      sport: "Rock Climbing",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Winter",
      teachers: ["michael.onorati@ycdsbk12.ca", "george.azar@ycdsbk12.ca"],
      points: 5,
      year: "2025-26",
    },
    {
      id: 14,
      sport: "Rugby",
      gender: "Boys",
      grade: "Jr.",
      season: "Spring",
      teachers: [
        "george.azar@ycdsbk12.ca",
        "michael.onorati@ycdsbk12.ca",
        "mark.johnson@ycdsbk12.ca",
        "rocky.savoia@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 15,
      sport: "Rugby",
      gender: "Boys",
      grade: "Sr.",
      season: "Spring",
      teachers: [
        "george.azar@ycdsbk12.ca",
        "michael.onorati@ycdsbk12.ca",
        "mark.johnson@ycdsbk12.ca",
        "rocky.savoia@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 16,
      sport: "Rugby Sevens",
      gender: "Boys",
      grade: "Jr.",
      season: "Fall",
      teachers: [
        "michael.onorati@ycdsbk12.ca",
        "george.azar@ycdsbk12.ca",
        "rocky.savoia@ycdsbk12.ca",
        "mark.johnson@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 17,
      sport: "Rugby Sevens",
      gender: "Boys",
      grade: "Sr.",
      season: "Fall",
      teachers: [
        "george.azar@ycdsbk12.ca",
        "michael.onorati@ycdsbk12.ca",
        "mark.johnson@ycdsbk12.ca",
        "rocky.savoia@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 18,
      sport: "Rugby Sevens",
      gender: "Girls",
      grade: "Varsity",
      season: "Fall",
      teachers: ["stephanie.veitch@ycdsbk12.ca", "michael.onorati@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 19,
      sport: "Slow Pitch",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Spring",
      teachers: [
        "tiziana.hayhoe@ycdsbk12.ca",
        "melina.tedesco@ycdsbk12.ca",
        "natalie.ligato@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 20,
      sport: "Soccer",
      gender: "Boys",
      grade: "Jr.",
      season: "Fall",
      teachers: ["michele.petrone@ycdsbk12.ca", "domenico.coccia@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 21,
      sport: "Soccer",
      gender: "Boys",
      grade: "Sr.",
      season: "Fall",
      teachers: [
        "steven.sedran@ycdsbk12.ca",
        "michal.kirejczyk@ycdsbk12.ca",
        "anthony.petrone@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 22,
      sport: "Soccer",
      gender: "Girls",
      grade: "Jr.",
      season: "Spring",
      teachers: ["jordan.caruso@ycdsbk12.ca", "anthony.petrone@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 23,
      sport: "Soccer",
      gender: "Girls",
      grade: "Sr.",
      season: "Spring",
      teachers: [
        "alessia.landolfi@ycdsbk12.ca",
        "michal.kirejczyk@ycdsbk12.ca",
        "steven.sedran@ycdsbk12.ca",
        "michele.petrone@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 24,
      sport: "Swimming",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Winter",
      teachers: [
        "manuel.decompa@ycdsbk12.ca",
        "antonette.montanaro@ycdsbk12.ca",
        "alaa.al-shaikh@ycdsbk12.ca",
        "vanessa.vitale@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 25,
      sport: "Table Tennis",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Fall",
      teachers: ["david.beck@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 26,
      sport: "Tennis",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Fall",
      teachers: ["raimondo.pupolo@ycdsbk12.ca", "victoria.ah-chin@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 27,
      sport: "Track(Outdoor)",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Spring",
      teachers: [
        "roberto.rizzo@ycdsbk12.ca",
        "daniela.bonello@ycdsbk12.ca",
        "sabrina.buffa@ycdsbk12.ca",
        "julia.loschiavo@ycdsbk12.ca",
        "lori.gentile@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
    {
      id: 28,
      sport: "Ultimate Frisbee",
      gender: "Co-ed",
      grade: "Varsity",
      season: "Spring",
      teachers: ["david.west@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 29,
      sport: "Volleyball",
      gender: "Boys",
      grade: "Jr.",
      season: "Fall",
      teachers: ["adam.dandrea@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 30,
      sport: "Volleyball",
      gender: "Boys",
      grade: "Sr.",
      season: "Fall",
      teachers: ["michael.morrison@ycdsbk12.ca", "david.west@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 31,
      sport: "Volleyball",
      gender: "Girls",
      grade: "Jr.",
      season: "Fall",
      teachers: ["david.beck@ycdsbk12.ca"],
      points: 10,
      year: "2025-26",
    },
    {
      id: 32,
      sport: "Volleyball",
      gender: "Girls",
      grade: "Sr.",
      season: "Winter",
      teachers: [
        "stephanie.veitch@ycdsbk12.ca",
        "kasia.bak@ycdsbk12.ca",
        "lucy.araujo@ycdsbk12.ca",
      ],
      points: 10,
      year: "2025-26",
    },
  ];

  const resolvedParams = use(params);
  const team = data.find((item) => item.id === Number(resolvedParams.id));
  if (!team) {
    return <div>Team not found</div>;
  }
  const editSportForm = useForm<z.infer<typeof editSportSchema>>({
    resolver: zodResolver(editSportSchema),
    defaultValues:{
      sport: team.sport,
      gender: team.gender,
      grade: team.grade,
      season: team.season,
      teachers: team.teachers,
      points: team.points,
      year: team.year,
      seasonHighlights: team.seasonHighlights || "",
      yearbookMessage: team.yearbookMessage || ""
    }
  });
  function onEditSportSave(values: z.infer<typeof editSportSchema>){
    console.log(values)
  }
  return (
    <div className="px-16 py-24">
      <div className="font-bold text-3xl mb-4">
        {team.grade} {team.gender} {team.sport}
      </div>
      <div className="grid grid-cols-[1fr_2fr] gap-16">
        <div>
          <div className="text-xl font-semibold mb-4">
            Edit Team Information
          </div>
          <Form {...editSportForm}>
            <form
              onSubmit={editSportForm.handleSubmit(onEditSportSave)}
              className="space-y-4"
            >
              <FormField
                control={editSportForm.control}
                name="sport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sport Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sport name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Boys">Boys</SelectItem>
                        <SelectItem value="Girls">Girls</SelectItem>
                        <SelectItem value="Co-ed">Co-ed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Jr.">Junior</SelectItem>
                        <SelectItem value="Sr.">Senior</SelectItem>
                        <SelectItem value="Varsity">Varsity</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select season" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fall">Fall</SelectItem>
                        <SelectItem value="Winter">Winter</SelectItem>
                        <SelectItem value="Spring">Spring</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="teachers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coaches</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter season highlights"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="seasonHighlights"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season Highlights</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter season highlights"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="yearbookMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearbook Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a message for the yearbook"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="gap-2 flex justify-self-end">
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
        <div>
          <div className="text-xl font-semibold">Manage Players</div>
        </div>
      </div>
    </div>
  );
}