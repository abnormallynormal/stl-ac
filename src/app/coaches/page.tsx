"use client";
import Navigation from "@/components/navbar";
import { selectData } from "../functions/coaches";
import { columns, Coach } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Coaches() {
  const [data, setData] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);

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

  const copyCoaches = async () => {
    const formatted = (data ?? [])
      .map((entry, index) => `${index+1}\t${entry.coach}`)
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
            <Button variant="outline" size="sm" onClick={() => void copyCoaches()}>
              Copy Coaches
            </Button>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
