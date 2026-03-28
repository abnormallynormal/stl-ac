"use client";
import Navigation from "@/components/navbar";
import { selectData } from "../functions/coaches";
import { columns, Coach } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";
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

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="max-w-4xl justify-self-center w-full">
          <div className="flex mb-4 justify-between">
            <div className="font-bold text-3xl">Coaches</div>
          </div>
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </>
  );
}
