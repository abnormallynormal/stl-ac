"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type ActionResult = {
  error?: string;
  success?: boolean;
};

export async function login(prevState: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.log(error)
    
    let errorMessage = "Login failed. Please check your credentials.";
    
    if (error.message.includes("Invalid login credentials")) {
      errorMessage = "Invalid email or password. Please try again.";
    } else if (error.message.includes("Email not confirmed")) {
      errorMessage = "Please check your email and confirm your account before logging in.";
    } else {
      errorMessage = error.message;
    }
    
    return { error: errorMessage };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signUp(data);

  if (error) {
    console.log("Signup error:", error);
    return { error: error.message };
  }

  // Check if user was actually created
  if (
    authData.user &&
    authData.user.identities &&
    authData.user.identities.length === 0
  ) {
    // This means the email already exists
    return {
      error:
        "An account with this email already exists. Please log in instead.",
    };
  }

  // Check if we need email confirmation
  if (!authData.session) {
    return {
      success: true,
      error:wwwwww
        "Please check your email to confirm your account before logging in.",
    };
  }

  // Session exists - user is logged in
  revalidatePath("/", "layout");
  redirect("/");
}