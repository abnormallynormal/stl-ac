import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { selectData, addTeam } from "@/app/functions/teams";
import { selectData as selectSports } from "@/app/functions/sports";
import { Sport } from "@/app/sports/columns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
// Create schema function to include existing teams data for validation
const createFormSchema = (existingTeams: any[] = []) =>
  z
    .object({
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
      teachers: z.array(z.email("Invalid email address")).optional(),
      points: z.number().int().min(0, {
        message: "Points must be at least 0.",
      }),
      year: z.string().min(1, {
        message: "Year must be at least 1 character.",
      }),
    })
    .superRefine((values, ctx) => {
      // Check for duplicate team with same sport, gender, grade, and season
      const existingTeam = existingTeams.find(
        (team) =>
          team.sport?.name === values.sport &&
          team.gender === values.gender &&
          team.grade === values.grade,
      );

      if (existingTeam) {
        ctx.addIssue({
          code: "custom",
          message:
            "A team with this sport, gender, and grade combination already exists",
          path: ["sport"],
        });
      }
    });

interface AddTeamFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function AddTeamForm({
  onCancel,
  onSuccess,
}: AddTeamFormProps = {}) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [existingTeams, setExistingTeams] = useState<any[]>([]);

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
      points: 10, // Default points value
      year: "2025-26", // Set to current year
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const result = await addTeam({
        sport: values.sport,
        grade: values.grade,
        gender: values.gender,
        season: values.season,
        year: values.year,
        teachers: [],
      });

      if (result) {
        form.reset();
        onSuccess?.();
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          form.handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
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
                    const selectedSport = sports.find((s) => s.name === value);
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
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {sports.map(({ name, points }) => (
                      <SelectItem key={name} value={name}>
                        {name} ({points} points)
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
                <SelectContent className="max-h-[300px] overflow-y-auto">
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
                <SelectContent className="max-h-[300px] overflow-y-auto">
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
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  <SelectItem value="Fall">Fall</SelectItem>
                  <SelectItem value="Winter">Winter</SelectItem>
                  <SelectItem value="Spring">Spring</SelectItem>
                </SelectContent>
              </Select>
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
              onCancel?.();
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {
              form.handleSubmit(onSubmit);
            }}
          >
            Submit
          </Button>
        </div>
      </form>

    </Form>
  );
}
