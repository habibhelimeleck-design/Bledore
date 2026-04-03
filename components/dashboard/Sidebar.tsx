"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard, User, Images, Briefcase, Search,
  Users, FileText, LogOut, ChevronRight, Settings
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";
import type { Profile } from "@/lib/types/database";

interface SidebarProps {
  profile: Profile;
  role: "face" | "producer";
}

const FACE_LINKS = [
  { href: "/face",             label: "Tableau de bord",  icon: LayoutDashboard },
  { href: "/face/profil",      label: "Mon profil",       icon: User },
  { href: "/face/galerie",     label: "Ma galerie",       icon: Images },
  { href: "/face/missions",    label: "Missions",         icon: Search },
  { href: "/face/candidatures",label: "Mes candidatures", icon: Briefcase },
];

const PRODUCER_LINKS = [
  { href: "/producteur",              label: "Tableau de bord",  icon: LayoutDashboard },
  { href: "/producteur/missions",     label: "Mes missions",     icon: FileText },
  { href: "/producteur/talents",      label: "Catalogue talents",icon: Users },
  { href: "/producteur/candidatures", label: "Candidatures",     icon: Briefcase },
  { href: "/producteur/compte",       label: "Mon compte",       icon: Settings },
];

export default function Sidebar({ profile, role }: SidebarProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const supabase = createClient();
  const links    = role === "face" ? FACE_LINKS : PRODUCER_LINKS;

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-[var(--border)] px-4 py-6 gap-1">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-6 px-1 group">
        <div className="w-8 h-8 rounded-lg bg-em-900 flex items-center justify-center group-hover:bg-em-700 transition-colors flex-shrink-0">
          <span className="font-heading font-semibold text-white text-sm">E</span>
        </div>
        <span className="font-heading text-xl font-semibold text-ink tracking-tight">
          E.<span className="text-em-500">Talent</span>
        </span>
      </Link>

      {/* Profile card */}
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-em-50 mb-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-em-100 flex-shrink-0 ring-2 ring-em-200">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center text-em-700 font-semibold text-sm">
              {initials(profile.full_name)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink text-sm truncate">{profile.full_name}</p>
          <p className="text-em-600 text-xs capitalize">{role === "face" ? "Talent" : "Recruteur"}</p>
        </div>
        <ChevronRight size={14} className="text-sand-300 flex-shrink-0" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== `/${role}` && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${active ? "active" : ""}`}
            >
              <Icon size={17} className="flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <button onClick={signOut}
        className="sidebar-link text-red-500 hover:bg-red-50 hover:text-red-600 mt-2 w-full text-left">
        <LogOut size={17} />
        Se déconnecter
      </button>
    </aside>
  );
}
