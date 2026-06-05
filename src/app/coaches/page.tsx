"use client";
import Navigation from "@/components/navbar";
import { selectData } from "../functions/coaches";
import { columns, Coach } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSchoolYear } from "@/lib/school-year-context";

export default function Coaches() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByLastName, setSortByLastName] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex justify-center items-center h-32">
            <div>Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  const getLastNameFromEmail = (email: string) => {
    const localPart = email.split("@")[0] ?? "";
    const nameParts = localPart.split(".").filter(Boolean);
    return nameParts[nameParts.length - 1] ?? localPart;
  };

  const currentYearData = data.filter(
    (coach) => coach.year === selectedYear
  );

  const sortedData = sortByLastName
    ? [...currentYearData].sort((a, b) =>
        getLastNameFromEmail(a.coach).localeCompare(
          getLastNameFromEmail(b.coach)
        )
      )
    : currentYearData;

  const copyCoaches = async () => {
    const formatted = (sortedData ?? [])
      .map((entry, index) => `${index + 1}\t${entry.coach}`)
      .join("\n");
    await navigator.clipboard.writeText(formatted);
  };

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex mb-4 items-center gap-3">
            <div className="font-bold text-3xl">Coaches</div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void copyCoaches()}
            >
              Copy Coaches
            </Button>
          </div>
          <DataTable
            columns={columns({
              onToggleLastNameSort: () =>
                setSortByLastName((current) => !current),
            })}
            data={sortedData}
          />
        </div>
      </div>
    </>
  );
}
