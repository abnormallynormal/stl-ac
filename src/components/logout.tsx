"use client"
import { Button } from "./ui/button";
import {createClient} from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
export default function Logout() {
  const router = useRouter();
  async function signOut() {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if(!error){
      router.push("/login");
    }
    else{
      console.log(error);
    }
  }
  return(
    <Button onClick={signOut}>
      Log Out
    </Button>
  )
}