export const SCHOOL_YEARS = ["2025-26", "2024-25", "2023-24"] as const;

export type SchoolYear = (typeof SCHOOL_YEARS)[number];

export const CURRENT_SCHOOL_YEAR: SchoolYear = SCHOOL_YEARS[0];
