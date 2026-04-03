import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebarToggle from "@/components/dashboard/MobileSidebarToggle";

export default async function RecruteurLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "producer") redirect("/talent");

  return (
    <div className="flex h-screen bg-sand-50 overflow-hidden">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar profile={profile} role="producer" />
      </div>
      <MobileSidebarToggle profile={profile} role="producer" />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 lg:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
