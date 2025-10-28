"use client";
import { useState } from "react";
import Navigation from "@/components/navbar";
import Link from "next/link";

export default function EmailPage() {
  return (
    <>
      <Navigation />
      <div className="h-screen overflow-hidden flex flex-col justify-start items-center pt-12 bg-background text-foreground">
        <div className="text-3xl font-bold mb-8">Email Options</div>

        <div className="flex flex-col ">
          {/* Button 1: Email Secretary */}
          <Link
            href="/emails/student-list"
            className="border-t border-r border-l py-3 px-6 transition-all bg-background hover:bg-accent duration-200 w-144"
          >
            <div className="text-xl mb-2">Student List Request</div>
            <div className="text-sm">Send an email to the Maplewood secretary to request an .xlsx spreadsheet to update the student records.</div>
          </Link>

          {/* Button 2: Email Coaches */}
          <Link
            href="/emails/update-roster"
            className="border py-3 px-6 shadow-md transition-all bg-background hover:bg-accent duration-200 w-144"
          >
            <div className="text-xl mb-2">Roster Update Email</div>
            <div className="text-sm">Send a batch of emails to coaches to have them fill out their roster and managers, track payments, and declare MVP and Character Awards.</div>
          </Link>
        </div>
      </div>
    </>
  );
}