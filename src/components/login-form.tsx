"use client"
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [page, setPage] = useState<"login" | "signup">("login");
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>{page === "login" ? "Login to your account" : "Sign up for an account"}</CardTitle>
          <CardDescription>
            {page === "login"
              ? "Enter your email below to login to your account"
              : "Enter your email below to sign up for an account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {page === "login" ? "Forgot your password?" : ""}
                  </a>
                </div>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  {page === "login" ? "Login" : "Sign Up"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {page === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <a
                href="#"
                onClick={() => setPage(page === "login" ? "signup" : "login")}
                className="underline underline-offset-4"
              >
                {page === "login" ? "Sign up" : "Login"}
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
