"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, PlayerWithPoints } from "./columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/students";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export default function Points() {
  const [data, setData] = useState<PlayerWithPoints[]>();
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    const getPoints = async () => {
      try {
        const data = await selectData();
        if (!data) {
          console.log("Error fetching players");
        }
        setData(
          data
            ?.filter((student) => student.points > 0)
            .map((student) => ({
              student_id: student.id,
              name: student.name,
              points: student.points,
            }))
        );
      } catch {
        console.log("Error fetching players");
      }
    };
    getPoints();
  }, []);

  const filteredData = data?.filter((student) => {
    // Filter by name - check both "Last, First" and "First Last" formats
    const filterLower = filter.toLowerCase();
    const nameLower = student.name.toLowerCase();

    // Check original format (e.g., "Doe, John")
    const originalMatch = nameLower.includes(filterLower);
    const noComma = nameLower.replace(",", "").includes(filterLower);
    // Check reversed format (e.g., "John Doe" when name is stored as "Doe, John")
    const nameParts = nameLower.split(", ");
    const reversedName =
      nameParts.length === 2 ? `${nameParts[1]} ${nameParts[0]}` : nameLower;
    const reversedMatch = reversedName.includes(filterLower);

    const nameMatch = originalMatch || reversedMatch || noComma;

    // Filter by grade if any grade filters are selected
    return nameMatch;
  });
  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="mb-2 justify-between">
            <div className="font-bold text-4xl mb-2">
              This year's recipients
            </div>
            <Accordion type="multiple" className="w-full mb-8">
              <AccordionItem value="outstanding-contribution">
                <AccordionTrigger>
                  <div>
                    <div className="font-semibold text-2xl hover:underline mb-1">
                      Outstanding Contribution
                    </div>
                    <div className="text-lg">Gr. 12: 100+ points</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {data
                    ?.filter((student) => student.points >= 100)
                    .map((student) => (
                      <div
                        key={student.student_id}
                        className="text-sm text-gray-500"
                      >
                        {student.name}: {student.points} points
                      </div>
                    ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="letter-of-distinction">
                <AccordionTrigger>
                  <div>
                    <div className="font-semibold text-2xl hover:underline mb-1">
                      Letter of Distinction
                    </div>
                    <div className="text-lg">90 points</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {data
                    ?.filter((student) => student.points >= 90)
                    .map((student) => (
                      <div
                        key={student.student_id}
                        className="text-sm text-gray-500"
                      >
                        {student.name}: {student.points} points
                      </div>
                    ))}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="letter-of-merit">
                <AccordionTrigger>
                  <div>
                    <div className="font-semibold text-2xl hover:underline mb-1">
                      Letter of Merit
                    </div>
                    <div className="text-lg">60 points</div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {data
                    ?.filter((student) => student.points >= 60)
                    .map((student) => (
                      <div
                        key={student.student_id}
                        className="text-sm text-gray-500"
                      >
                        {student.name}: {student.points} points
                      </div>
                    ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="font-bold text-3xl mb-4">Points</div>
          <div className="flex items-center gap-4 mb-2">
            <Input
              placeholder="Filter by name"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon">
                  <Filter />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 mr-4">
                <div className="flex flex-col gap-2">
                  <div className="font-semibold mb-2">Filter by points</div>
                  <Input
                    placeholder="Lower bound"
                    type="number"
                    value={pointsFilter?.lower}
                    onChange={(e) =>
                      setPointsFilter((prev) => ({
                        lower: Number(e.target.value),
                        upper: prev?.upper,
                      }))
                    }
                  />
                  <Input
                    placeholder="Upper bound"
                    type="number"
                    value={pointsFilter?.upper}
                    onChange={(e) =>
                      setPointsFilter((prev) => ({
                        lower: prev?.lower,
                        upper: Number(e.target.value),
                      }))
                    }
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPointsFilter(undefined)}
                  >
                    Clear Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover> */}
          </div>
        </div>
        <DataTable columns={columns} data={filteredData ?? []} />
      </div>
    </>
  );
}
