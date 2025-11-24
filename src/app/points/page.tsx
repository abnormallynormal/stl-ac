"use client";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, PlayerWithPoints } from "./columns";
import { PreviousWinner } from "./previous-winners/columns";
import { useEffect, useState } from "react";
import { selectData } from "../functions/students";
import { selectPreviousWinners, addWinner, updateWinner } from "../functions/awards";
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
  const [prevWinners, setPrevWinners] = useState<PreviousWinner[]>();
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
        const prevData = await selectPreviousWinners();
        if (!prevData) {
          console.log("Error fetching players");
        }
        console.log("Previous winners raw data:", prevData);
        setPrevWinners(
          prevData
            ?.filter((winner) => winner.student_points?.points > 0)
            .map((winner) => ({
              student_id: winner.id,
              name: winner.student_points?.name || "",
              points: winner.student_points?.points || 0,
              year: winner.year,
              award: winner.award,
            }))
        );
        console.log(
          "Mapped previous winners:",
          prevData?.map((winner) => ({
            student_id: winner.id,
            award: winner.award,
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

  async function updateRecipients() {
    const recipients = data?.filter((student) => student.points >= 60);
    
    // Process all recipients sequentially
    const promises = recipients?.map(async (student) => {
      const prevWinner = prevWinners?.find(
        (winner) => winner.student_id === student.student_id
      );
      const prevOutstandingWinner = prevWinners?.find(
        (winner) =>
          winner.student_id === student.student_id &&
          winner.award === "Outstanding Contribution"
      );
      if (!prevOutstandingWinner && student.points >= 100) {
        if(prevWinner){
          await updateWinner({id: student.student_id, award: "Outstanding Contribution", year: new Date().getFullYear()});
        } else {
          await addWinner({
            id: student.student_id,
            award: "Outstanding Contribution",
            year: new Date().getFullYear(),
          });
        }
      }
      const prevDistinctionWinner = prevWinners?.find(
        (winner) =>
          winner.student_id === student.student_id &&
          winner.award === "Letter of Distinction"
      );
      if (
        !prevDistinctionWinner &&
        student.points >= 90 &&
        student.points < 100
      ) {
        if (prevWinner) {
          await updateWinner({
            id: student.student_id,
            award: "Letter of Distinction",
            year: new Date().getFullYear(),
          });
        } else {
          await addWinner({
            id: student.student_id,
            award: "Letter of Distinction",
            year: new Date().getFullYear(),
          });
        }
      }
      const prevMeritWinner = prevWinners?.find(
        (winner) =>
          winner.student_id === student.student_id &&
          winner.award === "Letter of Merit"
      );
      if (!prevMeritWinner && student.points >= 60 && student.points < 90) {
        await addWinner({
          id: student.student_id,
          award: "Letter of Merit",
          year: new Date().getFullYear(),
        });
      }
    }) || [];
    
    // Wait for all updates to complete
    await Promise.all(promises);
    
    // Refetch the complete list of previous winners
    const prevData = await selectPreviousWinners();
    setPrevWinners(
      prevData
        ?.filter((winner) => winner.student_points?.points > 0)
        .map((winner) => ({
          student_id: winner.id,
          name: winner.student_points?.name || "",
          points: winner.student_points?.points || 0,
          year: winner.year,
          award: winner.award,
        }))
    );
  }
  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="justify-self-center w-full">
          <div className="mb-2 justify-between">
            <div className="flex flex-row gap-4 items-center mb-2">
              <div className="font-bold text-4xl">
                This year&apos;s recipients
              </div>
              <Button onClick={updateRecipients}>Archive recipients</Button>
            </div>
            <a
              className="text-lg font-semibold hover:underline"
              href="/points/previous-winners"
            >
              View past recipients
            </a>
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
                  {(() => {
                    const filtered = data?.filter((student) => {
                      const hasWonBefore = prevWinners?.some((winner) => {
                        const match =
                          winner.student_id === student.student_id &&
                          winner.award === "Outstanding Contribution";
                        return match;
                      });
                      return student.points >= 100 && !hasWonBefore;
                    });

                    return filtered && filtered.length > 0 ? (
                      filtered.map((student) => (
                        <div
                          key={student.student_id}
                          className="text-sm text-gray-500"
                        >
                          {student.name}: {student.points} points
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        There are no Outstanding Contributions at this time.
                      </div>
                    );
                  })()}
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
                  {(() => {
                    const filtered = data?.filter((student) => {
                      const hasWonBefore = prevWinners?.some((winner) => {
                        const match =
                          winner.student_id === student.student_id &&
                          winner.award === "Letter of Distinction";
                        return match;
                      });
                      return (
                        student.points >= 90 &&
                        student.points < 100 &&
                        !hasWonBefore
                      );
                    });

                    return filtered && filtered.length > 0 ? (
                      filtered.map((student) => (
                        <div
                          key={student.student_id}
                          className="text-sm text-gray-500"
                        >
                          {student.name}: {student.points} points
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        There are no Letter of Distinctions at this time.
                      </div>
                    );
                  })()}
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
                  {(() => {
                    const filtered = data?.filter((student) => {
                      const hasWonBefore = prevWinners?.some((winner) => {
                        const match =
                          winner.student_id === student.student_id &&
                          winner.award === "Letter of Merit";
                        return match;
                      });
                      return (
                        student.points >= 60 &&
                        student.points < 90 &&
                        !hasWonBefore
                      );
                    });

                    return filtered && filtered.length > 0 ? (
                      filtered.map((student) => (
                        <div
                          key={student.student_id}
                          className="text-sm text-gray-500"
                        >
                          {student.name}: {student.points} points
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">
                        There are no Letter of Merits at this time.
                      </div>
                    );
                  })()}
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
