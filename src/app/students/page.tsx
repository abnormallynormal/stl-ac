"use client";
import Navigation from "@/components/navbar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Student, columns } from "./columns";
import { DataTable } from "./data-table";
import { selectData } from "@/app/functions/students";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Students() {
  const [data, setData] = useState<Student[]>([]);
  useEffect(() => {
    const loadData = async () => {
      try{
        const result = await selectData();
        if (result) {
          setData(result);
        } else {
          setData([]);
        }
      } catch (error) {
        console.log(error)
      }
    }
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

  const handleGradeFilterChange = (grade: keyof typeof gradeFilters, checked: boolean) => {
    setGradeFilters(prev => ({
      ...prev,
      [grade]: checked
    }));
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
    // Filter by name
    const nameMatch = student.name.toLowerCase().includes(filter.toLowerCase());
    
    // Filter by grade if any grade filters are selected
    const selectedGrades: number[] = Object.entries(gradeFilters)
      .filter(([_, isSelected]) => isSelected)
      .map(([grade, _]) => {
        switch (grade) {
          case 'nine': return 9;
          case 'ten': return 10;
          case 'eleven': return 11;
          case 'twelve': return 12;
          default: return 0;
        }
      });
    
    const gradeMatch = selectedGrades.length === 0 || selectedGrades.includes(student.grade);
    
    // Filter by graduation status (active students vs graduated)
    const graduationMatch = includeGraduated || student.active;
    
    return nameMatch && gradeMatch && graduationMatch;
  });
  return (
    <>
      <Navigation />

      <div className="px-16 py-24">
        <div className="text-3xl font-bold mb-2">Student List</div>
        <div className="flex gap-4 items-center mb-8">
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
        </div>
        <DataTable columns={columns} data={filteredData} />
      </div>
    </>
  );
}
