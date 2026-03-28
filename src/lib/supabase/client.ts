import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Surface misconfigured envs in the browser console
    console.error("Missing Supabase env vars in browser", {
      hasUrl: Boolean(url),
      hasAnonKey: Boolean(key),
    });
  }

  return createBrowserClient(url ?? "", key ?? "");
}
