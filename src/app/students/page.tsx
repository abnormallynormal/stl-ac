"use client";
import Navigation from "@/components/navbar";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addPlayer } from "@/app/functions/students";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Student, createColumns } from "./columns";
import { DataTable } from "./data-table";
import { selectData } from "@/app/functions/students";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character."),
  email: z
    .email("Enter a valid email address.")
    .min(1, "Enter a valid email address."),
  grade: z
    .int("Grade must be a number.")
    .min(9, "Grade must be at least 9.")
    .max(12, "Grade must be at most 12."),
});

export default function Students() {
  const [data, setData] = useState<Student[]>([]);
  const [isAddByCSVOpen, setIsAddByCSVOpen] = useState(false);
  const [isAddByManualOpen, setIsAddByManualOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      grade: undefined,
    },
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        } else {
          setData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
  }, []);
  const [filter, setFilter] = useState<string>("");
  const [gradeFilters, setGradeFilters] = useState({
    nine: false,
    ten: false,
    eleven: false,
    twelve: false,
  });
  const [includeGraduated, setIncludeGraduated] = useState(false);

  const handleGradeFilterChange = (
    grade: keyof typeof gradeFilters,
    checked: boolean
  ) => {
    setGradeFilters((prev) => ({
      ...prev,
      [grade]: checked,
    }));
  };
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await addPlayer({
        name: values.name,
        email: values.email,
        grade: values.grade,
      } as Student);
      const result = await selectData();
      if (result) {
        setData(result);
      }

      setIsAddByManualOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding data:", error);
    }
  };
  const clearFilters = () => {
    setGradeFilters({
      nine: false,
      ten: false,
      eleven: false,
      twelve: false,
    });
    setIncludeGraduated(false);
    setFilter("");
  };

  const filteredData = data.filter((student) => {
    // Filter by name - check both "Last, First" and "First Last" formats
    const filterLower = filter.toLowerCase();
    const nameLower = student.name.toLowerCase();
    
    // Check original format (e.g., "Doe, John")
    const originalMatch = nameLower.includes(filterLower);
    const noComma = nameLower.replace(",", "").includes(filterLower);
    // Check reversed format (e.g., "John Doe" when name is stored as "Doe, John")
    const nameParts = nameLower.split(", ");
    const reversedName = nameParts.length === 2 ? `${nameParts[1]} ${nameParts[0]}` : nameLower;
    const reversedMatch = reversedName.includes(filterLower);
    
    const nameMatch = originalMatch || reversedMatch || noComma;
    
    // Filter by grade if any grade filters are selected
    const selectedGrades: number[] = Object.entries(gradeFilters)
      .filter(([_, isSelected]) => isSelected)
      .map(([grade, _]) => {
        switch (grade) {
          case "nine":
            return 9;
          case "ten":
            return 10;
          case "eleven":
            return 11;
          case "twelve":
            return 12;
          default:
            return 0;
        }
      });

    const gradeMatch =
      selectedGrades.length === 0 || selectedGrades.includes(student.grade);

    // Filter by graduation status (active students vs graduated)
    const graduationMatch = includeGraduated || student.active;

    return nameMatch && gradeMatch && graduationMatch;
  });
  const columns = createColumns({
    onEdit: (student) => {
    },
    onDelete: (student) => {
    },
  });
  return (
    <>
      <Navigation />

      <div className="px-16 py-8">
        <div className="text-3xl font-bold mb-4">Student List</div>
        <div className="flex gap-4 items-center mb-2">
          <Input
            placeholder="Filter by name"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary" size="icon">
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 mr-4">
              <div className="flex flex-col gap-2">
                <div className="font-semibold">Filter by grade</div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2">
                    <Checkbox
                      id="nine"
                      checked={gradeFilters.nine}
                      onCheckedChange={(checked) =>
                        handleGradeFilterChange("nine", checked as boolean)
                      }
                    />
                    <Label className="flex items-center gap-2" htmlFor="nine">
                      9th Grade
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Checkbox
                      id="ten"
                      checked={gradeFilters.ten}
                      onCheckedChange={(checked) =>
                        handleGradeFilterChange("ten", checked as boolean)
                      }
                    />
                    <Label className="flex items-center gap-2" htmlFor="ten">
                      10th Grade
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Checkbox
                      id="eleven"
                      checked={gradeFilters.eleven}
                      onCheckedChange={(checked) =>
                        handleGradeFilterChange("eleven", checked as boolean)
                      }
                    />
                    <Label className="flex items-center gap-2" htmlFor="eleven">
                      11th Grade
                    </Label>
                  </div>
                  <div className="flex gap-2">
                    <Checkbox
                      id="twelve"
                      checked={gradeFilters.twelve}
                      onCheckedChange={(checked) =>
                        handleGradeFilterChange("twelve", checked as boolean)
                      }
                    />
                    <Label className="flex items-center gap-2" htmlFor="twelve">
                      12th Grade
                    </Label>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label className="text-md font-semibold" htmlFor="all">
                      Include graduated students?
                    </Label>
                    <Checkbox
                      id="all"
                      checked={includeGraduated}
                      onCheckedChange={(checked) =>
                        setIncludeGraduated(checked as boolean)
                      }
                    />
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus />
                Add Students
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="">
              <DropdownMenuItem onClick={() => setIsAddByCSVOpen(true)}>
                Add by CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsAddByManualOpen(true)}>
                Add by Manual Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Dialog open={isAddByCSVOpen} onOpenChange={setIsAddByCSVOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add by CSV</DialogTitle>
              <DialogDescription>
                Upload a CSV file to add students. The file should have the
                following columns:
                <br />
                Name, Email, Grade
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Dialog open={isAddByManualOpen} onOpenChange={setIsAddByManualOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add by Manual Entry</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                className="space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="John Doe" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="johndoe@example.com" />
                      </FormControl>
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
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="10"
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const num = e.target.valueAsNumber;
                            field.onChange(Number.isNaN(num) ? undefined : num);
                          }}
                        />
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
                      form.reset({ grade: undefined });
                      setIsAddByManualOpen(false);
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
        <DataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
}
