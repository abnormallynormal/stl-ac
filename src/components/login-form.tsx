"use client"
import { cn } from "@/lib/utils";
import { login, signup } from "@/app/login/actions";
import { useState, useActionState } from "react";
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

interface LoginFormProps extends React.ComponentProps<"div"> {
  defaultTab?: "login" | "signup"
}

export function LoginForm({
  className,
  defaultTab = "login",
  ...props
}: LoginFormProps) {
  const [page, setPage] = useState<"login" | "signup">(defaultTab);
  const [loginState, loginAction, isLoginPending] = useActionState(login, null);
  const [signupState, signupAction, isSignupPending] = useActionState(signup, null);
  
  const currentState = page === "login" ? loginState : signupState;
  const currentAction = page === "login" ? loginAction : signupAction;
  const isPending = page === "login" ? isLoginPending : isSignupPending;
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
          <form action={currentAction}>
            <div className="flex flex-col gap-6">
              {currentState?.error && (
                <div className={`p-4 rounded-lg border ${
                  currentState.error.toLowerCase().includes('email') && 
                  currentState.error.toLowerCase().includes('confirm')
                    ? 'bg-green-50 border-green-300 '
                    : 'bg-destructive/10 border-destructive/20'
                }`}>
                  <p className={`text-sm font-medium ${
                    currentState.error.toLowerCase().includes('email') && 
                    currentState.error.toLowerCase().includes('confirm')
                      ? 'text-green-700'
                      : 'text-destructive'
                  }`}>
                    {currentState.error}
                  </p>
                </div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    
                    className="cursor-pointer ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    {page === "login" ? "Forgot your password?" : ""}
                  </a>
                </div>
                <Input id="password" name="password" type="password" placeholder="••••••••" required disabled={isPending} />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Please wait..." : (page === "login" ? "Login" : "Sign Up")}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              {page === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <a
                onClick={() => setPage(page === "login" ? "signup" : "login")}
                className="cursor-pointer underline underline-offset-4"
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
