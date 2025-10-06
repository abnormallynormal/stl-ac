"use client";
import { Team } from "../columns";
import { Player, createColumns } from "./columns";
import { DataTable } from "./data-table";
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
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { useState, use, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { selectData, selectSports, updateSport, deleteSport } from "../../functions/teams";
const createEditSportSchema = (
  existingTeams: Team[] = [],
  currentTeamId?: number
) =>
  z
    .object({
      sport: z.string().min(1, "Sport is required"),
      gender: z.string().min(1, "Gender is required"),
      grade: z.string().min(1, "Grade is required"),
      season: z.string().min(1, "Season is required"),
      year: z.string().min(1, "Year is required"),
      teachers: z
        .array(z.email("Invalid email address"))
        .min(1, "At least one teacher is required"),
      points: z.number().int().min(0, "Points must be a non-negative integer"),
      seasonHighlights: z.string().optional(),
      yearbookMessage: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const existingTeam = existingTeams.find(
        (team) =>
          team.id !== currentTeamId &&
          team.sport === values.sport &&
          team.gender === values.gender &&
          team.grade === values.grade
      );

      if (existingTeam && existingTeam.id !== currentTeamId) {
        ctx.addIssue({
          code: "custom",
          message:
            "A team with this sport, gender, and grade combination already exists",
          path: ["sport"],
        });
      }
    });
export default function TeamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [data, setData] = useState<Team[]>([]);
  const [sports, setSports] = useState<{ sport: string; points: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Player | null>(null);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [deleteTeamIsOpen, setDeleteTeamIsOpen] = useState(false);
  const router = useRouter();
  const columns = createColumns({
    onDelete: (player) => {
      setToBeDeleted(player);
      setDeleteIsOpen(true);
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsResult, sportsResult] = await Promise.all([
          selectData(),
          selectSports(),
        ]);
        console.log("Fetched teams data:", teamsResult);
        console.log("Fetched sports data:", sportsResult);

        if (teamsResult) {
          setData(teamsResult);
          console.log("Teams data set to state:", teamsResult);
        }
        if (sportsResult) {
          setSports(sportsResult);
          console.log("Sports data set to state:", sportsResult);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const players: Player[] = [
    {
      id: 1,
      name: "Player 1",
      grade: 10,
      champs: true,
      MVP: true,
      LDA: false,
      paid: false,
    },
  ];

  const availableTeachers = [
    "martin.nicholls@ycdsbk12.ca",
    "richard.ow@ycdsbk12.ca",
    "tiziana.hayhoe@ycdsbk12.ca",
    "michael.morrison@ycdsbk12.ca",
    "domenico.coccia@ycdsbk12.ca",
    "jordan.caruso@ycdsbk12.ca",
    "adam.dandrea@ycdsbk12.ca",
    "anthony.petrone@ycdsbk12.ca",
    "alexander.dasilva@ycdsbk12.ca",
    "michele.petrone@ycdsbk12.ca",
    "brian.villavazera@ycdsbk12.ca",
    "david.beck@ycdsbk12.ca",
    "daniela.bonello@ycdsbk12.ca",
    "jennifer.hickey@ycdsbk12.ca",
    "sabrina.buffa@ycdsbk12.ca",
    "paola.amoroso@ycdsbk12.ca",
    "alexandra.carvier@ycdsbk12.ca",
    "michael.onorati@ycdsbk12.ca",
    "dan.nero@ycdsbk12.ca",
    "mark.johnson@ycdsbk12.ca",
    "manuel.decompa@ycdsbk12.ca",
    "antonette.montanaro@ycdsbk12.ca",
    "alaa.al-shaikh@ycdsbk12.ca",
    "vanessa.vitale@ycdsbk12.ca",
    "raimondo.pupolo@ycdsbk12.ca",
    "victoria.ah-chin@ycdsbk12.ca",
    "roberto.rizzo@ycdsbk12.ca",
    "julia.loschiavo@ycdsbk12.ca",
    "lori.gentile@ycdsbk12.ca",
    "david.west@ycdsbk12.ca",
    "stephanie.veitch@ycdsbk12.ca",
    "kasia.bak@ycdsbk12.ca",
    "lucy.araujo@ycdsbk12.ca",
  ];

  const resolvedParams = use(params);
  const team = data.find((item) => item.id === Number(resolvedParams.id));
  const editSportSchema = createEditSportSchema(data, team?.id);
  const editSportForm = useForm<z.infer<typeof editSportSchema>>({
    resolver: zodResolver(editSportSchema),
    defaultValues: {
      sport: "",
      gender: "",
      grade: "",
      season: "",
      teachers: [],
      points: 0,
      year: "",
      seasonHighlights: "",
      yearbookMessage: "",
    },
  });

  const [formInitialized, setFormInitialized] = useState(false);

  useEffect(() => {
    if (team && !formInitialized) {
      setSelectedTeachers(team.teachers);
      console.log("Setting form values with team data:", team);

      editSportForm.reset({
        sport: team.sport,
        gender: team.gender,
        grade: team.grade,
        season: team.season,
        teachers: team.teachers,
        points: team.points,
        year: team.year,
        seasonHighlights: team.seasonHighlights || "",
        yearbookMessage: team.yearbookMessage || "",
      });

      setFormInitialized(true);
      console.log("Form values after reset:", editSportForm.getValues());
    }
  }, [team, formInitialized]);

  if (loading || !formInitialized) {
    return <div className="px-16 py-24">Loading team data...</div>;
  }

  if (error) {
    return <div className="px-16 py-24">Error loading team data: {error}</div>;
  }

  if (!team) {
    return <div className="px-16 py-24">Team not found</div>;
  }

  const addTeacher = (teacher: string) => {
    if (!selectedTeachers.includes(teacher)) {
      const newTeachers = [...selectedTeachers, teacher];
      setSelectedTeachers(newTeachers);
      editSportForm.setValue("teachers", newTeachers);
    }
    setTeacherSearchOpen(false);
  };

  const removeTeacher = (teacher: string) => {
    const newTeachers = selectedTeachers.filter((t) => t !== teacher);
    setSelectedTeachers(newTeachers);
    editSportForm.setValue("teachers", newTeachers);
  };

  const getTeacherDisplayName = (email: string) => {
    const name = email.split("@")[0];
    return name
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };
  const onEditSportSave = async (values: z.infer<typeof editSportSchema>) => {
    try {
      console.log("Updating team with values:", values);

      const result = await updateSport({
        id: team.id,
        sport: values.sport,
        points: values.points,
        year: values.year,
        season: values.season,
        grade: values.grade,
        gender: values.gender,
        teachers: values.teachers,
        seasonHighlights: values.seasonHighlights || "",
        yearbookMessage: values.yearbookMessage || "",
      });

      if (result) {
        console.log("Team updated successfully:", result);
        // Refresh the team data
        const refreshedData = await selectData();
        if (refreshedData) {
          setData(refreshedData);
        }
        alert("Team updated successfully!");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      alert("Failed to update team. Please try again.");
    }
  };

  const onDeleteTeam = async () => {
    try {
      console.log("Deleting team with id:", team.id);
      
      const result = await deleteSport({ id: team.id });
      
      if (result) {
        console.log("Team deleted successfully:", result);
        // Navigate back to teams page
        router.push("/teams");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

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
                    <FormLabel>Sport</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Find the selected sport and set its points
                        const selectedSport = sports.find(
                          (s) => s.sport === value
                        );
                        if (selectedSport) {
                          editSportForm.setValue(
                            "points",
                            selectedSport.points
                          );
                        }
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sports.map(({ sport, points }) => (
                          <SelectItem key={sport} value={sport}>
                            {sport} ({points} points)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="season"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="2025-26">2025-26</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={editSportForm.control}
                name="teachers"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Coaches</FormLabel>
                      <Button
                        type="button"
                        className="p-0 h-auto text-gray-500"
                        variant="link"
                        onClick={() => setTeacherSearchOpen(true)}
                      >
                        Add Coaches
                      </Button>
                    </div>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2 min-h-[2.5rem] px-3 py-2 border rounded-md">
                          {selectedTeachers.length === 0 ? (
                            <div className="text-muted-foreground text-sm">
                              No coaches selected
                            </div>
                          ) : (
                            selectedTeachers.map((teacher) => (
                              <Badge
                                key={teacher}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {getTeacherDisplayName(teacher)}
                                <X
                                  className="h-3 w-3 cursor-pointer rounded-full"
                                  onClick={() => removeTeacher(teacher)}
                                />
                              </Badge>
                            ))
                          )}
                        </div>
                      </div>
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
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteTeamIsOpen(true)}
                >
                  Delete Team
                </Button>
                <div className="gap-2 flex">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4 ">
            <div className="text-xl font-semibold">Manage Players</div>
            <Button onClick={() => setAddPlayerOpen(true)}>Add Player</Button>
          </div>
          <DataTable columns={columns} data={players} />
          <AlertDialog>
            <AlertDialog open={deleteIsOpen} onOpenChange={setDeleteIsOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete{" "}
                    {toBeDeleted?.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => console.log(toBeDeleted)}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </AlertDialog>
          <AlertDialog>
            <AlertDialog
              open={deleteTeamIsOpen}
              onOpenChange={setDeleteTeamIsOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to delete {team.grade}{" "}
                    {team.gender} {team.sport}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDeleteTeam}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </AlertDialog>
          <CommandDialog open={addPlayerOpen} onOpenChange={setAddPlayerOpen}>
            <DialogTitle className="sr-only">Add Player</DialogTitle>
            <CommandInput placeholder="Search for a player to add..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
          </CommandDialog>

          <CommandDialog
            open={teacherSearchOpen}
            onOpenChange={setTeacherSearchOpen}
          >
            <DialogTitle className="sr-only">Search Teachers</DialogTitle>
            <CommandInput placeholder="Search for a teacher to add..." />
            <CommandList>
              <CommandEmpty>No teachers found.</CommandEmpty>
              <CommandGroup>
                {availableTeachers
                  .filter((teacher) => !selectedTeachers.includes(teacher))
                  .map((teacher) => (
                    <CommandItem
                      key={teacher}
                      value={teacher}
                      onSelect={() => addTeacher(teacher)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {getTeacherDisplayName(teacher)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {teacher}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </div>
    </div>
  );
}
