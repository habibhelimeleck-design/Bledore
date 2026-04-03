import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LayoutDashboard, Users, FileText, Flag, CheckSquare, LogOut } from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin",             label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/utilisateurs",label: "Utilisateurs",   icon: Users },
  { href: "/admin/missions",    label: "Missions",       icon: FileText },
  { href: "/admin/verification",label: "Vérification",  icon: CheckSquare },
  { href: "/admin/signalements",label: "Signalements",  icon: Flag },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && user.email !== adminEmail) redirect("/");

  return (
    <div className="flex h-screen bg-sand-50 overflow-hidden">
      {/* Admin sidebar */}
      <aside className="flex flex-col w-60 h-full bg-ink border-r border-white/10 px-4 py-6 gap-1 flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 mb-6 px-1">
          <div className="w-8 h-8 rounded-lg bg-em-500 flex items-center justify-center">
            <span className="font-heading font-semibold text-white text-sm">E</span>
          </div>
          <span className="font-heading text-xl font-semibold text-white tracking-tight">Admin</span>
        </Link>

        <p className="text-white/30 text-xs font-mono uppercase tracking-widest px-2 mb-2">Navigation</p>

        <nav className="flex-1 flex flex-col gap-0.5">
          {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Icon size={16} className="flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-4 mt-2">
          <p className="text-white/40 text-xs px-2 truncate">{user.email}</p>
          <Link href="/api/auth/signout" className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
            <LogOut size={15} />Se déconnecter
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-8">{children}</div>
      </main>
    </div>
  );
}
