import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { selectSports, selectData, addSport } from "@/app/functions/teams"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useState } from "react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command"
import { DialogTitle } from "@/components/ui/dialog"
import { X } from "lucide-react"
// Create schema function to include existing teams data for validation
const createFormSchema = (existingTeams: any[] = []) => z.object({
  sport: z.string().min(1, {
    message: "Sport name must be at least 1 character.",
  }),
  grade: z.string().min(1, {
    message: "Grade must be at least 1 character.",
  }),
  gender: z.string().min(1, {
    message: "Gender must be at least 1 character.",
  }),
  season: z.string().min(1, {
    message: "Season must be at least 1 character.",
  }),
  teachers: z
    .array(z.string().email("Invalid email address"))
    .min(1, "At least one teacher is required"),
  points: z.number().int().min(0, {
    message: "Points must be at least 0.",
  }),
  year: z.string().min(1, {
    message: "Year must be at least 1 character.",
  }),
}).superRefine((values, ctx) => {
  // Check for duplicate team with same sport, gender, grade, and season
  const existingTeam = existingTeams.find(
    (team) => 
      team.sport === values.sport &&
      team.gender === values.gender &&
      team.grade === values.grade
  );
  
  if (existingTeam) {
    ctx.addIssue({
      code: "custom",
      message: "A team with this sport, gender, and grade combination already exists",
      path: ["sport"],
    });
  }
});

interface AddTeamFormProps {
  onTeacherSearchOpen?: () => void;
  onTeacherSearchClose?: () => void;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function AddTeamForm({ onTeacherSearchOpen, onTeacherSearchClose, onCancel, onSuccess }: AddTeamFormProps = {}){
  const [sports, setSports] = useState<{sport: string, points: number}[]>([]);
  const [existingTeams, setExistingTeams] = useState<any[]>([]);
  const [teacherSearchOpen, setTeacherSearchOpen] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
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

  useEffect(() => {
    selectSports().then((data) => setSports(data || []));
    selectData().then((data) => setExistingTeams(data || []));
  }, []);

  const formSchema = createFormSchema(existingTeams);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sport: "",
      grade: "",
      gender: "",
      season: "",
      teachers: [],
      points: 10, // Default points value
      year: "2025-26", // Set to current year
    },
  });

  const addTeacher = (teacher: string) => {
    if (!selectedTeachers.includes(teacher)) {
      const newTeachers = [...selectedTeachers, teacher];
      setSelectedTeachers(newTeachers);
      form.setValue("teachers", newTeachers);
    }
    setTeacherSearchOpen(false);
    onTeacherSearchClose?.();
  };

  const removeTeacher = (teacher: string) => {
    const newTeachers = selectedTeachers.filter((t) => t !== teacher);
    setSelectedTeachers(newTeachers);
    form.setValue("teachers", newTeachers);
  };

  const getTeacherDisplayName = (email: string) => {
    const name = email.split("@")[0];
    return name
      .split(".")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  };
  async function onSubmit(values: z.infer<typeof formSchema>) {
    
    try {
      const result = await addSport({
        sport: values.sport,
        grade: values.grade,
        gender: values.gender,
        season: values.season,
        year: values.year,
        teachers: values.teachers,
        points: values.points,
      });
      
      console.log("addSport result:", result);
      
      if (result) {
        console.log("Team created successfully:", result);
        form.reset();
        setSelectedTeachers([]);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={(e) => {
        form.handleSubmit(onSubmit)(e);
      }} className="space-y-4">
        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    // Find the selected sport and set its points
                    const selectedSport = sports.find(s => s.sport === value);
                    if (selectedSport) {
                      form.setValue("points", selectedSport.points);
                    }
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sports.map(({sport, points}) => (
                      <SelectItem key={sport} value={sport}>
                        {sport} ({points} points)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="grade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="season"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Season</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          control={form.control}
          name="teachers"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Coaches</FormLabel>
                <Button
                  type="button"
                  className="p-0 h-auto text-gray-500"
                  variant="link"
                  onClick={() => {
                    setTeacherSearchOpen(true);
                    onTeacherSearchOpen?.();
                  }}
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
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => {
              form.reset();
              setSelectedTeachers([]);
              onCancel?.();
            }}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={() => {
            form.handleSubmit(onSubmit);
          }}>Submit</Button>
        </div>
      </form>
      
      <CommandDialog
        open={teacherSearchOpen}
        onOpenChange={(open) => {
          setTeacherSearchOpen(open);
          if (!open) {
            onTeacherSearchClose?.();
          }
        }}
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
    </Form>
  );
}