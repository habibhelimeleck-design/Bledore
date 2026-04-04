import { createClient } from "@/lib/supabase/server";
import MissionsClient, { type Mission } from "./MissionsClient";

export default async function MissionsSection() {
  const supabase = await createClient();

  const { data: missions } = await supabase
    .from("missions")
    .select(`
      id, title, category, location, is_remote,
      budget_min, budget_max, currency, deadline, status, required_skills,
      profiles ( full_name, producer_accounts ( company_name, is_verified ) )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  return <MissionsClient missions={(missions as Mission[]) ?? []} />;
}