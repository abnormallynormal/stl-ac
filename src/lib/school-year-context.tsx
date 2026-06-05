"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { SCHOOL_YEARS, SchoolYear, DEFAULT_SCHOOL_YEAR } from "./constants";

interface SchoolYearContextType {
  selectedYear: SchoolYear;
  setSelectedYear: (year: SchoolYear) => void;
}

const SchoolYearContext = createContext<SchoolYearContextType | undefined>(
  undefined
);

export function SchoolYearProvider({ children }: { children: ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<SchoolYear>(DEFAULT_SCHOOL_YEAR);

  return (
    <SchoolYearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </SchoolYearContext.Provider>
  );
}

export function useSchoolYear() {
  const context = useContext(SchoolYearContext);
  if (!context) {
    throw new Error("useSchoolYear must be used within SchoolYearProvider");
  }
  return context;
}
