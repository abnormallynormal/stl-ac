"use client";
import Navigation from "@/components/navbar";
import { selectData } from "../functions/coaches";
import { columns, Coach } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useSchoolYear } from "@/lib/school-year-context";

export default function Coaches() {
  const { selectedYear } = useSchoolYear();
  const [data, setData] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortByLastName, setSortByLastName] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await selectData();
        if (result) {
          setData(result);
        }
      } catch (error) {
        setLoadError("Failed to load coaches. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
    setCopyError(null);
    setIsCopying(true);
    try {
      const formatted = (sortedData ?? [])
        .map((entry, index) => `${index + 1}\t${entry.coach}`)
        .join("\n");
      await navigator.clipboard.writeText(formatted);
    } catch (error) {
      setCopyError("Failed to copy coaches. Please try again.");
    } finally {
      setIsCopying(false);
    }
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
              disabled={isCopying}
            >
              {isCopying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Copy Coaches"
              )}
            </Button>
          </div>
          {(loadError || copyError) && (
            <p className="text-sm text-destructive mb-2">
              {loadError ?? copyError}
            </p>
          )}
          <DataTable
            columns={columns({
              onToggleLastNameSort: () =>
                setSortByLastName((current) => !current),
            })}
            data={sortedData}
            isLoading={loading}
          />
        </div>
      </div>
    </>
  );
}
