"use client";
import { useState, useEffect } from "react";
import Navigation from "@/components/navbar";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Team } from "@/app/teams/columns";
import { selectData } from "@/app/functions/teams";
import { Button } from "@/components/ui/button";
import { Select } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function EmailPage() {
  const [message, setMessage] = useState(
    "Hello, please follow the link below to update the roster for your team. "
  );
  const [season, setSeason] = useState("All");
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsBySeason, setTeamsBySeason] = useState<Team[]>([]);
  useEffect(() => {
    const fetchTeams = async () => {
      const data = await selectData();
      if (data) {
        setTeams(data);
        setTeamsBySeason(data)
      }
    };
    fetchTeams();
  }, []);

  const toggleTeam = (team: Team) => {
    setSelectedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  useEffect(() => {
    const visibleIds = filteredTeams.map((t) => t.id.toString());
    setSelectedTeams((prev) => prev.filter((team) => visibleIds.includes(team.id.toString())));
  }, [season, teams]);

  const filteredTeams =
    season === "All" ? teams : teams.filter((t) => t.season === season);

  async function loopTeams() {
    selectedTeams.forEach((team: Team) => {
      const to = team.team_coaches?.map(tc => tc.coaches.email) ?? [];
      const subject = `Update Student Roster`;
      const link = `https://stl-ac.vercel.app/teams/${team.id}`;
      handleSend({to,subject, link});
    })
  }

  async function handleSend({
    to,
    subject,
    link
  }: {
    to: string[];
    subject: string;
    link: string;
  }) {

    const text = `${message}`;
    const html = `
      <p>${message}</p>
      <p><a href="${link}">Team Link</a></p>
    `;

    const res = await fetch("/api/updateRoster", {  
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to,            // array of emails
        subject,       // subject line
        text,          // plaintext version
        html           // HTML version (clickable link)
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Email sent!");
    } else {
      alert("Failed to send email.");
    }
  }

  return (
    <>
      <Navigation />
      <div className="p-6 ml-10 mr-10">
        <div className="text-3xl font-bold mb-4">Send Roster Update Email</div>
        <div className="mb-4">
          Select which teams you would like to send a Roster Update request to.
          Each coach will be emailed a link that will allow them to update their
          roster, add managers, record championships, track payments, and assign
          MVP/LCA. The link will be set to expire in 3 months.
        </div>
        <div className="flex items-center flex-row gap-4 mb-4">
          <div>
            Select season: 
          </div>
          <Select value={season} onValueChange={(season) => {
            setSeason(season);
            setTeamsBySeason(season === "All" ? teams : teams.filter((team) => team.season === season))
          }}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Fall">Fall</SelectItem>
              <SelectItem value="Winter">Winter</SelectItem>
              <SelectItem value="Spring">Spring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns(toggleTeam, selectedTeams, setSelectedTeams, teamsBySeason)}
          data={filteredTeams}
        />

        <div className="p-6 mb-20">
          <b>Message:</b>
          <Textarea
            className="mb-2"
            placeholder="Message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            className="text-white px-4 py-2 rounded"
            onClick={loopTeams}
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
