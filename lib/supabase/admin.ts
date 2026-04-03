import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client with service_role key — bypasses RLS.
 * Only use in server-side admin routes.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
