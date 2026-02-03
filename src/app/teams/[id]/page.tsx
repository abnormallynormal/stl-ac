"use client";
import { Student } from "@/app/students/columns";
import Navigation from "@/components/navbar";
import { Team } from "../columns";
import { Player, createColumns } from "./columns";
import { Manager, createManagerColumns } from "./managerColumns";
import { DataTable } from "./data-table";
import { selectData as selectCoaches } from "@/app/functions/coaches";
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
import { useState, use, useEffect, useMemo } from "react";
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
import {
  selectData,
  updateTeam,
  deleteTeam,
} from "../../functions/teams";
import {selectData as selectSports} from "@/app/functions/sports"
import {
  selectablePlayers,
  selectTeamPlayers,
  addPlayer as addPlayerApi,
  deletePlayer as deletePlayerApi,
  updateCheckbox,
  selectableManagers,
  selectTeamManagers,
  addManager,
  deleteManager,
  updateManagerPaid,
} from "@/app/functions/team";
import { selectData as selectStudents } from "@/app/functions/students";
import { Input } from "@/components/ui/input";
import {
  getFinances,
  markManagerAsPaid,
  markManagerAsUnpaid,
} from "@/app/functions/finances";
import { Finance } from "@/app/finances/columns";
import { Coach } from "@/app/coaches/columns";
import { Sport } from "@/app/sports/columns";
const createEditTeamSchema = (
  existingTeams: Team[] = [],
  currentTeamId?: number
) =>
  z
    .object({
      sport_id: z.number().int().min(1, "Sport is required"),
      gender: z.string().min(1, "Gender is required"),
      grade: z.string().min(1, "Grade is required"),
      season: z.string().min(1, "Season is required"),
      year: z.string().min(1, "Year is required"),
      teachers: z
        .array(z.email("Invalid email address"))
        .min(1, "At least one coach is required"),
      points: z.number().int().min(0, "Points must be a non-negative integer"),
      seasonHighlights: z.string().optional(),
      yearbookMessage: z.string().optional(),
    })
    .superRefine((values, ctx) => {
      const existingTeam = existingTeams.find(
        (team) =>
          team.id !== currentTeamId &&
          team.sport_id === values.sport_id &&
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
  const [finances, setFinances] = useState<Finance[]>();
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>();
  const [availableCoaches, setAvailableCoaches] = useState<Coach[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState<Player | null>(null);
  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [coachSearchOpen, setCoachSearchOpen] = useState(false);
  const [selectedCoaches, setSelectedCoaches] = useState<string[]>([]);
  const [deleteTeamIsOpen, setDeleteTeamIsOpen] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [addableManagers, setAddableManagers] = useState<Student[]>([]);
  const [addManagerOpen, setAddManagerOpen] = useState(false);
  const [toBeDeletedManager, setToBeDeletedManager] = useState<Manager | null>(
    null
  );
  const [deleteManagerIsOpen, setDeleteManagerIsOpen] = useState(false);

  const router = useRouter();
  const getPayments = async () => {
    try {
      const financesResult = await getFinances();
      if (financesResult) {
        setFinances(financesResult);
      }
    } catch (error) {
      console.error("Error getting finances:", error);
      alert("Failed to get finances. Please try again.");
    }
  };
  const columns = createColumns({
    actions: {
      onDelete: (player) => {
        setToBeDeleted(player);
        setDeleteIsOpen(true);
      },
      onUpdateCheckbox: (playerId, field, value) => {
        // Optimistic update - update players state immediately
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === playerId ? { ...player, [field]: value } : player
          )
        );
      },
      onSelectAll: (field) => {
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) => ({
            ...player,
            [field]: true,
          }))
        );
        players.map((player) => {
          updateCheckbox({ playerId: player.id, param: field, value: true });
        });
      },
      onUpdateRadio: (playerId, field, value) => {
        // For radio buttons, we need to clear other radio options and set the selected one
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === playerId
              ? {
                  ...player,
                  mvp: field === "mvp" ? true : player.mvp,
                  lca: field === "lca" ? true : player.lca,
                }
              : {
                  ...player,
                  mvp: field === "mvp" ? false : player.mvp,
                  lca: field === "lca" ? false : player.lca,
                }
          )
        );
      },
    },
    reloadData: (data: Player[]) => {
      setPlayers(data);
      getPayments();
    },
    finances: finances ?? [],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsResult, sportsResult] = await Promise.all([
          selectData(),
          selectSports(),
        ]);

        if (teamsResult) {
          setData(teamsResult);
        }
        if (sportsResult) {
          setSports(sportsResult);
        }
        getPayments();
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  const [addablePlayers, setAddablePlayers] = useState<Student[]>([]);
  const [filter, setFilter] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playersResult = await selectTeamPlayers(
          Number(resolvedParams.id)
        );
        if (playersResult) {
          setPlayers(playersResult);
        }
      } catch (err) {
        console.error("Error fetching players data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load players data"
        );
      }
    };

    loadPlayers();
  }, []);
  useEffect(() => {
    const loadAddablePlayers = async () => {
      try {
        const playersResult = await selectablePlayers(
          Number(resolvedParams.id)
        );
        if (playersResult) {
          // selectablePlayers returns a Student[]; assert to Player[] to satisfy the state typing
          setAddablePlayers(playersResult as unknown as Student[]);
        }
      } catch (err) {
        console.error("Error fetching players data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load players data"
        );
      }
    };

    loadAddablePlayers();
  }, []);
  const onDeletePlayer = async (player: Player) => {
    try {
      await deletePlayerApi(player.id);
      setPlayers(players.filter((p) => p.id !== player.id));
      try {
        const playersResult = await selectablePlayers(
          Number(resolvedParams.id)
        );
        if (playersResult) {
          // selectablePlayers returns a Student[]; assert to Player[] to satisfy the state typing
          setAddablePlayers(playersResult as unknown as Student[]);
        }
      } catch (err) {
        console.error("Error fetching players data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load players data"
        );
      }
      setDeleteIsOpen(false);
    } catch (err) {
      console.error("Error deleting player:", err);
      setError(err instanceof Error ? err.message : "Failed to delete player");
    }
  };
  useEffect(() => {
    const loadAllStudents = async () => {
      try {
        const studentsResult = await selectStudents();
        if (studentsResult) {
          setAllStudents(studentsResult);
        }
      } catch (err) {
        console.error("Error fetching all students data:", err);
      }
    };

    loadAllStudents();
  }, []);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const managersResult = await selectTeamManagers(
          Number(resolvedParams.id)
        );
        if (managersResult) setManagers(managersResult);
      } catch (err) {
        console.error("Error fetching managers:", err);
      }
    };
    loadManagers();
  }, []);
  useEffect(() => {
    const loadAddableManagers = async () => {
      try {
        const managersResult = await selectableManagers(
          Number(resolvedParams.id)
        );
        if (managersResult) setAddableManagers(managersResult);
      } catch (err) {
        console.error("Error fetching selectable managers:", err);
      }
    };
    loadAddableManagers();
  }, []);

  useEffect(() => {
    const loadCoaches = async () => {
    try {
      const coachesResult = await selectCoaches();
      if (coachesResult) {
        setAvailableCoaches(coachesResult);
      }
    } catch (err) {
      console.error("Error fetching coaches:", err);
    }
  };
  loadCoaches();
  }, []);

  const resolvedParams = use(params);
  const team = data.find((item) => item.id === Number(resolvedParams.id));
  const editTeamSchema = createEditTeamSchema(data, team?.id);
  const editTeamForm = useForm<z.infer<typeof editTeamSchema>>({
    resolver: zodResolver(editTeamSchema),
    defaultValues: {
      sport_id: 0,
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
      const coaches = team.team_coaches?.map(tc => tc.coaches.email) ?? [];
      setSelectedCoaches(coaches);
      setSelectedSport(team.sport?.name);

      editTeamForm.reset({
        sport_id: team.sport_id,
        gender: team.gender,
        grade: team.grade,
        season: team.season,
        teachers: coaches,
        points: team.sport?.points ?? 0,
        year: team.year,
        seasonHighlights: team.seasonHighlights || "",
        yearbookMessage: team.yearbookMessage || "",
      });

      setFormInitialized(true);
    }
  }, [team, formInitialized]);
  const filteredPlayers = useMemo(() => {
    const players = !filter.trim()
      ? addablePlayers
      : addablePlayers.filter((player) =>
          player.name.toLowerCase().includes(filter.toLowerCase())
        );
    return players.sort((a, b) => a.name.localeCompare(b.name));
  }, [addablePlayers, filter]);

  if (loading || !formInitialized) {
    return <div className="px-16 py-8">Loading team data...</div>;
  }

  if (error) {
    return <div className="px-16 py-8">Error loading team data: {error}</div>;
  }

  if (!team) {
    return <div className="px-16 py-8">Team not found</div>;
  }

  const addPlayer = async (player: Student) => {
    try {
      const result = await addPlayerApi({
        team_id: Number(resolvedParams.id),
        student_id: Number(player.id),
        yraa: false,
        ofsaa: false,
        mvp: false,
        lca: false,
        paid: false,
      });
      if (result) {
        // Refresh the players list
        const refreshedPlayers = await selectTeamPlayers(
          Number(resolvedParams.id)
        );
        if (refreshedPlayers) {
          setPlayers(refreshedPlayers);
        }

        // Update addable players list
        setAddablePlayers(addablePlayers.filter((p) => p.id !== player.id));

        // Close the dialog
        setAddPlayerOpen(false);
      }
    } catch (error) {
      console.error("Error adding player:", error);
      setError(error instanceof Error ? error.message : "Failed to add player");
    }
  };

  const addManagerHandler = async (student: Student) => {
    try {
      console.group("🧩 ADD MANAGER HANDLER DEBUG");
      console.log("➡️ Adding manager for:", student);

      // Call the helper (which now logs everything)
      const result = await addManager({
        team_id: Number(resolvedParams.id),
        student_id: student.id,
        paid: false,
      });

      console.log("✅ addManager() returned:", result);

      const refreshed = await selectTeamManagers(Number(resolvedParams.id));
      console.log("🔁 Refreshed managers:", refreshed);

      setManagers(refreshed);
      setAddableManagers(addableManagers.filter((p) => p.id !== student.id));
      setAddManagerOpen(false);

      console.groupEnd();
    } catch (error) {
      console.error("❌ Error adding manager:", error);
      console.groupEnd();
    }
  };

  const onDeleteManager = async (manager: Manager) => {
    try {
      await deleteManager(manager.id);
      setManagers(managers.filter((m) => m.id !== manager.id));
      setDeleteManagerIsOpen(false);
    } catch (err) {
      console.error("Error deleting manager:", err);
    }
  };

  const reloadManagers = async (data?: Manager[]) => {
    if (data) setManagers(data);
    await getPayments(); // refresh finances
    const refreshedPlayers = await selectTeamPlayers(Number(resolvedParams.id));
    setPlayers(refreshedPlayers);
  };

  const addCoach = (coach: string) => {
    if (!selectedCoaches.includes(coach)) {
      const newCoaches = [...selectedCoaches, coach];
      setSelectedCoaches(newCoaches);
      editTeamForm.setValue("teachers", newCoaches);
    }
    setCoachSearchOpen(false);
  };

  const removeCoach = (coach: string) => {
    const newCoaches = selectedCoaches.filter((c) => c !== coach);
    setSelectedCoaches(newCoaches);
    editTeamForm.setValue("teachers", newCoaches);
  };

  const getCoachDisplayName = (email: string) => {
    const name = email.split("@")[0];
    return name
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };
  const onEditSportSave = async (values: z.infer<typeof editTeamSchema>) => {
    try {
      // const selectedSport = sports.find(s => s.id === values.sport_id);
      const result = await updateTeam({
        id: team.id,
        sport_id: values.sport_id,
        // sport: selectedSport?.sport || "",
        year: values.year,
        season: values.season,
        grade: values.grade,
        gender: values.gender,
        teachers: values.teachers,
        seasonHighlights: values.seasonHighlights || "",
        yearbookMessage: values.yearbookMessage || "",
      });

      if (result) {
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
      const result = await deleteTeam({ id: team.id });

      if (result) {
        // Navigate back to teams page
        router.push("/teams");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      alert("Failed to delete team. Please try again.");
    }
  };

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="font-bold text-3xl mb-4">
          {team.grade} {team.gender} {team.sport?.name}
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-16">
          <div>
            <div className="text-xl font-semibold mb-4">
              Edit Team Information
            </div>
            <Form {...editTeamForm}>
              <form
                onSubmit={editTeamForm.handleSubmit(onEditSportSave)}
                className="space-y-4"
              >
                <FormField
                  control={editTeamForm.control}
                  name="sport_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sport</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          const sportId = parseInt(value);
                          field.onChange(sportId);
                          // Find the selected sport and set its name and points
                          const selectedSport = sports.find(
                            (s) => s.id === sportId
                          );
                          if (selectedSport) {
                            setSelectedSport(selectedSport.name);
                            editTeamForm.setValue(
                              "points",
                              selectedSport.points
                            );
                          }
                        }}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sport" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport.id} value={sport.id.toString()}>
                              {sport.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Points</FormLabel>
                      <Input {...field} disabled />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editTeamForm.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Season</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editTeamForm.control}
                  name="teachers"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Coaches</FormLabel>
                        <Button
                          type="button"
                          className="p-0 h-auto text-gray-500"
                          variant="link"
                          onClick={() => setCoachSearchOpen(true)}
                        >
                          Add Coaches
                        </Button>
                      </div>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2 min-h-[2.5rem] px-3 py-2 border rounded-md">
                            {selectedCoaches.length === 0 ? (
                              <div className="text-muted-foreground text-sm">
                                No coaches selected
                              </div>
                            ) : (
                              selectedCoaches.map((coach) => (
                                <Badge
                                  key={coach}
                                  variant="secondary"
                                  className="flex items-center gap-1"
                                >
                                  {getCoachDisplayName(coach)}
                                  <X
                                    className="h-3 w-3 cursor-pointer rounded-full"
                                    onClick={() => removeCoach(coach)}
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
                  control={editTeamForm.control}
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
                  control={editTeamForm.control}
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
            <div className="flex gap-6 items-center mb-4 ">
              <div className="text-xl font-semibold">Players</div>
              <Button
                onClick={() => {
                  setAddPlayerOpen(true);
                }}
                className="text-xs h-8"
              >
                Add Player
              </Button>
            </div>
            <DataTable
              columns={columns}
              data={players.map((player) => {
                const student = allStudents.find(
                  (s) => String(s.id) === String(player.student_id)
                );
                return {
                  ...player,
                  name: student?.name || `Student ${player.student_id}`,
                  grade: student?.grade || 0,
                };
              })}
            />
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
                    <AlertDialogAction
                      onClick={() => {
                        if (toBeDeleted) onDeletePlayer(toBeDeleted);
                      }}
                    >
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
                      {team.gender} {team.sport?.name || ""}?
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
              <CommandInput
                placeholder="Search for a player to add..."
                value={filter}
                onValueChange={(e) => setFilter(e)}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {filteredPlayers.map((player) => (
                    <CommandItem
                      key={player.id}
                      value={`$(player.id) ${player.email} $(player.name)`}
                      onSelect={() => {
                        addPlayer(player);
                        setAddPlayerOpen(false);
                      }}
                      // className="cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{player.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {player.email}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>

            <div className="flex gap-6 items-center mt-8 mb-4">
              <div className="text-xl font-semibold">Managers</div>
              <Button
                onClick={() => setAddManagerOpen(true)}
                className="text-xs h-8"
              >
                Add Manager
              </Button>
            </div>

            <DataTable
              columns={createManagerColumns({
                onDelete: (manager) => {
                  setToBeDeletedManager(manager);
                  setDeleteManagerIsOpen(true);
                },
                reloadData: reloadManagers,
                finances: finances ?? [],
              })}
              data={managers.map((manager) => {
                const student = allStudents.find(
                  (s) => String(s.id) === String(manager.student_id)
                );
                return {
                  ...manager,
                  name: student?.name || `Student ${manager.student_id}`,
                };
              })}
            />

            <AlertDialog
              open={deleteManagerIsOpen}
              onOpenChange={setDeleteManagerIsOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure you want to delete {toBeDeletedManager?.name}?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (toBeDeletedManager)
                        onDeleteManager(toBeDeletedManager);
                    }}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <CommandDialog
              open={addManagerOpen}
              onOpenChange={setAddManagerOpen}
            >
              <DialogTitle className="sr-only">Add Manager</DialogTitle>
              <CommandInput
                placeholder="Search for a manager..."
                value={filter}
                onValueChange={setFilter}
              />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {addableManagers.map((manager) => (
                    <CommandItem
                      key={manager.id}
                      onSelect={() => addManagerHandler(manager)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{manager.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {manager.email}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>

            <CommandDialog
              open={coachSearchOpen}
              onOpenChange={setCoachSearchOpen}
            >
              <DialogTitle className="sr-only">Search Coaches</DialogTitle>
              <CommandInput placeholder="Search for a coach to add..." />
              <CommandList>
                <CommandEmpty>No coaches found.</CommandEmpty>
                <CommandGroup>
                  {availableCoaches?.filter((coach) => !selectedCoaches.includes(coach.email))
                    .map((coach) => (
                      <CommandItem
                        key={coach.id}
                        value={coach.name}
                        onSelect={() => addCoach(coach.email)}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {coach.name}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {coach.email}
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
    </>
  );
}
