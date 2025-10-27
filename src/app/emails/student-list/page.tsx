"use client";
import { useState } from "react";
import Navigation from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EmailPage() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Student List Request");
  const [message, setMessage] = useState(`Greetings, the Phys Ed department needs a student alpha list extract from Maplewood to update their student athelete records.
To make the update process eaiser, could you please send me the extract in .xlsx format with the following headings:

First Name
Last Name
Grade
Student Number
Sex
Email

Thank you`);

  async function handleSend() {
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, text: message }),
    });

    const data = await res.json();
    alert(data.success ? "Email sent!" : "Failed to send email.");
  }

  return (
    <>
      <Navigation />
      <div className="p-6 ml-10 mr-10">
        <div className="text-3xl font-bold mb-4">Student List Request</div>
        <div className="font-bold">Maplewood Secretary's Email: </div>
        <Input
          className="border p-1 w-80 mb-2 ml-2"
          placeholder=""
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <div className="font-bold">Subject:</div>
        <Input
          className="border p-1 w-50 mb-2 ml-2"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div className="font-bold">Message:</div>
        <Textarea
          className="border p-2 w-full mb-2"
          placeholder="Message"
          rows={11}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          className="bg-blue-600 hover-blue-800 text-white px-4 py-2 rounded"
          onClick={handleSend}
        >
          Send
        </Button>
      </div>
    </>
  );
}
