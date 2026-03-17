"use client";

import Navigation from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { LoginForm } from "@/components/login-form";

type Admin = {
  email: string;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    const loadAdmins = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .range(0, 5000);

        if (error) {
          console.error("Error fetching users:", error);
          return;
        }

        const emails = (data ?? [])
          .map((row) => row.email)
          .filter((email): email is string => !!email)
          .map((email) => ({ email }));

        setAdmins(emails);
      } finally {
        setLoading(false);
      }
    };

    loadAdmins();
  }, []);

  return (
    <>
      <Navigation />
      <div className="px-16 py-8">
        <div className="max-w-xl justify-self-center w-full">
          <div className="flex mb-4 items-end justify-between">
            <div className="font-bold text-3xl">Admins</div>
            <Button
              onClick={() => setShowLoginForm((open) => !open)}
            >
              + Add
            </Button>
          </div>
          {showLoginForm ? (
            <div className="mb-6">
              <LoginForm defaultTab="signup" />
            </div>
          ) : null}
          <div className="overflow-hidden rounded-md border-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-4 py-2">Email</TableHead>
                  <TableHead className="px-4 py-2 w-12 text-right">
                    Edit(Temp)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : admins.length ? (
                  admins.map((admin) => (
                    <TableRow key={admin.email}>
                      <TableCell className="px-4">{admin.email}</TableCell>
                      <TableCell className="px-2 text-right">
                        <Button variant="link" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} className="h-24 text-center">
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
}
