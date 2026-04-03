import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Briefcase, Users, FileText, ArrowRight, Eye } from "lucide-react";
import { MISSION_STATUS_LABELS, MISSION_STATUS_BADGE, APPLICATION_STATUS_LABELS, APPLICATION_STATUS_BADGE, timeAgo } from "@/lib/utils";
import type { MissionStatus, ApplicationStatus } from "@/lib/types/database";

export default async function ProducteurDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: profile }, { data: missions }, { data: recentApps }, { data: producerAccount }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("missions").select("*, applications(count)").eq("producer_id", user.id)
      .order("created_at", { ascending: false }).limit(5),
    supabase.from("applications")
      .select("*, missions(title, id), profiles(full_name, avatar_url, city)")
      .in("mission_id",
        (await supabase.from("missions").select("id").eq("producer_id", user.id)).data?.map((m: any) => m.id) ?? []
      )
      .order("created_at", { ascending: false }).limit(6),
    supabase.from("producer_accounts").select("*").eq("profile_id", user.id).single(),
  ]);

  const allMissions = missions ?? [];
  const stats = {
    total:     allMissions.length,
    published: allMissions.filter((m: any) => m.status === "published").length,
    draft:     allMissions.filter((m: any) => m.status === "draft").length,
    candidates:(recentApps ?? []).length,
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Tableau de bord</p>
          <h1 className="font-heading text-h1 text-ink">
            Bonjour, <span className="italic text-em-600">{profile?.full_name?.split(" ")[0]}</span>
          </h1>
          {producerAccount && (
            <p className="text-sand-500 text-sm mt-0.5">{producerAccount.company_name}</p>
          )}
        </div>
        <Link href="/recruteur/missions/nouvelle" className="btn btn-em">
          <Plus size={16} /> Nouvelle mission
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Missions",    value: stats.total,     icon: FileText, color: "text-ink",       href: "/recruteur/missions" },
          { label: "Publiées",    value: stats.published, icon: Eye,      color: "text-em-600",    href: "/recruteur/missions" },
          { label: "Brouillons",  value: stats.draft,     icon: FileText, color: "text-gold-dark", href: "/recruteur/missions" },
          { label: "Candidatures",value: stats.candidates,icon: Users,    color: "text-sand-600",  href: "/recruteur/candidatures" },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="card p-5 hover:border-em-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-sand-400 font-mono uppercase tracking-wider">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <p className={`font-heading text-3xl font-semibold ${color}`}>{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Missions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Mes missions</h2>
            <Link href="/recruteur/missions" className="text-sm text-em-600 hover:text-em-400 flex items-center gap-1 transition-colors">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {allMissions.length === 0 ? (
              <div className="card p-8 text-center">
                <FileText size={24} className="text-sand-300 mx-auto mb-3" />
                <p className="font-semibold text-ink text-sm mb-1">Aucune mission</p>
                <Link href="/recruteur/missions/nouvelle" className="btn btn-em btn-sm mt-2">
                  <Plus size={14} /> Créer une mission
                </Link>
              </div>
            ) : allMissions.map((m: any) => (
              <Link key={m.id} href={`/recruteur/missions/${m.id}`}
                className="card p-4 flex items-center gap-3 hover:border-em-200">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{m.title}</p>
                  <p className="text-sand-500 text-xs">{m.category} · {timeAgo(m.created_at)}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {m.applications?.[0]?.count > 0 && (
                    <span className="badge badge-em text-xs">{m.applications[0].count} cand.</span>
                  )}
                  <span className={`badge ${MISSION_STATUS_BADGE[m.status as MissionStatus]}`}>
                    {MISSION_STATUS_LABELS[m.status as MissionStatus]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent candidatures */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Candidatures récentes</h2>
            <Link href="/recruteur/candidatures" className="text-sm text-em-600 hover:text-em-400 flex items-center gap-1 transition-colors">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {(recentApps ?? []).length === 0 ? (
              <div className="card p-8 text-center">
                <Briefcase size={24} className="text-sand-300 mx-auto mb-3" />
                <p className="font-semibold text-ink text-sm">Aucune candidature</p>
                <p className="text-sand-500 text-xs mt-1">Publiez une mission pour recevoir des candidatures.</p>
              </div>
            ) : (recentApps ?? []).map((app: any) => (
              <div key={app.id} className="card p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-em-100 flex items-center justify-center flex-shrink-0 text-em-700 font-semibold text-xs">
                  {app.profiles?.full_name?.split(" ").map((w: string) => w[0]).slice(0,2).join("").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{app.profiles?.full_name}</p>
                  <p className="text-sand-500 text-xs truncate">{app.missions?.title}</p>
                </div>
                <span className={`badge ${APPLICATION_STATUS_BADGE[app.status as ApplicationStatus]} flex-shrink-0`}>
                  {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
