"use client"
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Finance } from "./columns";
import { useEffect, useState } from "react";
import { getFinances } from "../functions/finances";
import { selectData } from "../functions/teams";
import { Team } from "../teams/columns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSchoolYear } from "@/lib/school-year-context";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Finances() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Finance[]>()
  const [teamData, setTeamData] = useState<Team[]>()
  const [filter, setFilter] = useState<string>("");
  useEffect(() => {
    const getPayments = async () => {
      try{
        const data = await getFinances();
        if(!data){
          //  console.log("Error fetching finances")
        }
        setData(data)
      } catch {
        //  console.log("Error fetching finances")
      }
    }
    getPayments();
  }, [])
  useEffect(() => {
    const getTeams = async () => {
      try {
        const data = await selectData();
        if (!data) {
          //  console.log("Error fetching teams");
        }
        setTeamData(data);
      } catch {
        //  console.log("Error fetching teams");
      }
    };
    getTeams();
  }, []);
  const currentYearData =
    data?.filter((student) => student.year === selectedYear) ?? [];

  const filteredData = currentYearData.filter((student) => {
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

  const sortedEmails = [
    ...new Set(
      currentYearData
        .map((student) => student.email?.trim())
        .filter((email): email is string => Boolean(email))
    ),
  ].sort((a, b) => a.localeCompare(b));

  const copyEmails = async () => {
    await navigator.clipboard.writeText(sortedEmails.join("\n"));
  };

  const sortedNames = currentYearData
    .map((student) => student.name?.trim())
    .filter((name): name is string => Boolean(name))
    .sort((a, b) => a.localeCompare(b));

  const copyNames = async () => {
    await navigator.clipboard.writeText(sortedNames.join("\n"));
  };

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="mb-2 justify-between">
            <div className="font-bold text-3xl mb-4">Finances</div>
            <div className="flex items-center">
              <Input
                placeholder="Filter by name"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
          <Accordion type="single" collapsible className="w-full mb-4">
            <AccordionItem value="email-list">
              <AccordionTrigger className="w-full py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold">Email List</div>
                  <Button asChild variant="outline" size="sm">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        void copyEmails();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          e.stopPropagation();
                          void copyEmails();
                        }
                      }}
                    >
                      Copy Emails
                    </span>
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-6">
                  {sortedEmails.map((email) => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <DataTable
            columns={columns({
              teams: teamData ?? [],
              onCopyNames: () => void copyNames(),
            })}
            data={filteredData ?? []}
          />
        </div>
      </div>
    </>
  );
}
