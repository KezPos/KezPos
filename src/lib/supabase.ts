import { createClient } from "@supabase/supabase-js";

/**
 * Same project the KezPos apps talk to (kezpos/lib/services/supabaseconfig.dart).
 * The anon key is public by design — it is already shipped inside the APK and is
 * protected by RLS. Never put a service_role key here.
 *
 * Override with VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY if the project moves.
 */
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://dlybnlyenjjvvagyxhgj.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRseWJubHllbmpqdnZhZ3l4aGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MTU3NzgsImV4cCI6MjA4NzM5MTc3OH0.KRlvP5cWpnxVii376-_wA-PHME2ZM6pFJJWtntxk5vA";

/**
 * Deliberately stateless: the reset/confirm pages get a session in memory from
 * verifyOtp, use it once, then drop it. Nothing is written to localStorage, so
 * a shared/public computer never keeps a KezPos session after the tab closes.
 */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});
