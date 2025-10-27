"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns, Team } from "./columns";
import { selectData } from "@/app/functions/teams";
import { Button } from "@/components/ui/button";

export default function EmailPage() {
  const [message, setMessage] = useState("Hello, please follow the link below to update the roster for your team.");
  const [season, setSeason] = useState("All");
  const [selectedTeams, setSelectedTeams] = useState<string[]>([])
  const [teams, setTeams] = useState<Team[]>([]);
  const [year, setYear] = useState("2025-2026");
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await selectData();
      if (data) setTeams(data);
    };
    fetchTeams();
  }, []);

  const toggleTeam = (id:string) => {
    setSelectedTeams((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const visibleIds = filteredTeams.map((t) => t.id.toString());
    setSelectedTeams((prev) => prev.filter((id) => visibleIds.includes(id)));
  }, [season, teams]);


  const filteredTeams = 
    season === "All" 
      ? teams
      : teams.filter((t) => t.season === season)

  async function testHandleSend() {
    console.log("Send button success");
  } 

  return (
    <>
      <Navigation />
      <div className="p-6 ml-10 mr-10">
        <h1 className="text-3xl font-bold mb-4" >Send Roster Update Email</h1>
        <p>Select which teams you would like to send a Roster Update request to. Each coach will be emailed a link that will allow them to update their roster, add managers, record championships, track payments, and assign MVP/LCA. The link will be set to expire in 3 months.</p>
        <br></br>
        <label htmlFor="season" className="text-foreground">
          <b>Select Season: </b>
        </label>
        <select
          id="season"
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="border p-1 bg-background text-foreground"
        >
          <option value="All">All</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
          <option value="Spring">Spring</option>
        </select>
      </div>

      <DataTable columns={columns(toggleTeam, selectedTeams, setSelectedTeams)} data={filteredTeams} />

      <div className="p-6 ml-10 mr-10 mb-20">
        <b>Message:</b>
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Message"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          className="text-white px-4 py-2 rounded"
          onClick={testHandleSend}
        >
          Send
        </Button>
      </div>
    </>
  );
}
