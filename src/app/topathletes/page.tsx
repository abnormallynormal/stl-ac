"use client";
import Navigation from "@/components/navbar";
import { selectData } from "../functions/topathletes";
import { createColumns, TopAthlete } from "./columns";
import { DataTable } from "./data-table";
import { useState, useEffect } from "react";

export default function TopAthletes() {
  const [data, setData] = useState<TopAthlete[]>([]);
  const [loading, setLoading] = useState(true);
  const teamCountThreshold = 3;
  const teamCountMultiplier = 1;
  const yRaaMultiplier = 0.5;
  const ofsaaMultiplier = 2;
  const mvpMultiplier = 1;
  const lcaMultiplier = 0.5;

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

  const columns = createColumns();

  const safeNumber = (value: number | null | undefined) => value ?? 0;
  const normalizeGender = (value: string | null | undefined) =>
    (value ?? "").trim().toLowerCase();

  const filteredData = data.filter((athlete) => {
    const teamCount = safeNumber(athlete.team_count);
    const ofsaa = safeNumber(athlete.ofsaa);
    const mvp = safeNumber(athlete.mvp);
    const lca = safeNumber(athlete.lca);
    return teamCount >= teamCountThreshold || ofsaa >= 1 || mvp >= 1 || lca >= 1;
  });

  const getMeritScore = (athlete: TopAthlete) =>
    safeNumber(athlete.team_count) * teamCountMultiplier +
    safeNumber(athlete.yraa) * yRaaMultiplier +
    safeNumber(athlete.ofsaa) * ofsaaMultiplier +
    safeNumber(athlete.mvp) * mvpMultiplier +
    safeNumber(athlete.lca) * lcaMultiplier;

  const sortedData = [...filteredData].sort(
    (a, b) => getMeritScore(b) - getMeritScore(a)
  );

  const jrBoys = sortedData.filter((athlete) => {
    const gender = normalizeGender(athlete.gender);
    const grade = safeNumber(athlete.grade);
    return gender === "male" && grade <= 10 && grade >= 9;
  });
  const jrGirls = sortedData.filter((athlete) => {
    const gender = normalizeGender(athlete.gender);
    const grade = safeNumber(athlete.grade);
    return gender === "female" && grade <= 10 && grade >= 9;
  });
  const srBoys = sortedData.filter((athlete) => {
    const gender = normalizeGender(athlete.gender);
    const grade = safeNumber(athlete.grade);
    return gender === "male" && grade >= 11;
  });
  const srGirls = sortedData.filter((athlete) => {
    const gender = normalizeGender(athlete.gender);
    const grade = safeNumber(athlete.grade);
    return gender === "female" && grade >= 11;
  });

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
        <div className="max-w-5xl justify-self-center w-full">
          <div className="flex mb-4 justify-between">
            <div className="font-bold text-3xl">Top Athletes</div>
          </div>
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="font-semibold text-2xl">Jr Boys</div>
              <DataTable columns={columns} data={jrBoys} />
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-2xl">Jr Girls</div>
              <DataTable columns={columns} data={jrGirls} />
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-2xl">Sr Boys</div>
              <DataTable columns={columns} data={srBoys} />
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-2xl">Sr Girls</div>
              <DataTable columns={columns} data={srGirls} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
