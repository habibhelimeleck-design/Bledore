import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CheckCircle2, Clock, Star, ArrowRight, User, Images, Search } from "lucide-react";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_BADGE, formatDate, timeAgo } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types/database";

export default async function FaceDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const [{ data: profile }, { data: applications }, { data: missions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("applications")
      .select("*, missions(id, title, category, status, deadline, profiles(full_name, avatar_url), producer_accounts(company_name))")
      .eq("face_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("missions")
      .select("*")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const stats = {
    total:       (applications ?? []).length,
    pending:     (applications ?? []).filter((a) => a.status === "pending").length,
    shortlisted: (applications ?? []).filter((a) => a.status === "shortlisted").length,
    accepted:    (applications ?? []).filter((a) => a.status === "accepted").length,
  };

  const profileComplete = !!(profile?.city && profile?.bio && profile?.skills?.length);

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sand-500 text-sm font-mono uppercase tracking-widest mb-1">Tableau de bord</p>
        <h1 className="font-heading text-h1 text-ink">
          Bonjour, <span className="italic text-em-600">{profile?.full_name?.split(" ")[0]}</span> 👋
        </h1>
      </div>

      {/* Profile completion banner */}
      {!profileComplete && (
        <div className="mb-6 p-4 rounded-2xl bg-gold-muted border border-gold-DEFAULT/30 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-DEFAULT/20 flex items-center justify-center flex-shrink-0">
            <Star size={18} className="text-gold-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sand-800 text-sm">Complétez votre profil</p>
            <p className="text-sand-500 text-xs mt-0.5">Un profil complet augmente vos chances d'être sélectionné.</p>
          </div>
          <Link href="/face/profil" className="btn btn-gold btn-sm flex-shrink-0">
            Compléter
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Candidatures", value: stats.total,       icon: CheckCircle2, color: "text-ink" },
          { label: "En attente",   value: stats.pending,     icon: Clock,        color: "text-gold-dark" },
          { label: "Présélectionné",value: stats.shortlisted,icon: Star,         color: "text-em-600" },
          { label: "Accepté",      value: stats.accepted,    icon: CheckCircle2, color: "text-green-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-sand-400 font-mono uppercase tracking-wider">{label}</span>
              <Icon size={16} className={color} />
            </div>
            <p className={`font-heading text-3xl font-semibold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent applications */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink">Mes candidatures récentes</h2>
            <Link href="/face/candidatures" className="text-sm text-em-600 hover:text-em-400 flex items-center gap-1 transition-colors">
              Voir tout <ArrowRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {(applications ?? []).length === 0 ? (
              <div className="card p-8 text-center">
                <Search size={28} className="text-sand-300 mx-auto mb-3" />
                <p className="font-semibold text-ink text-sm mb-1">Aucune candidature</p>
                <p className="text-sand-500 text-sm mb-4">Explorez les missions disponibles.</p>
                <Link href="/face/missions" className="btn btn-em btn-sm">Voir les missions</Link>
              </div>
            ) : (applications ?? []).map((app: any) => (
              <div key={app.id} className="card p-4 flex items-center gap-4">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-em-100 flex-shrink-0">
                  {app.missions?.profiles?.avatar_url ? (
                    <Image src={app.missions.profiles.avatar_url} alt="" fill className="object-cover" />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-em-600 text-xs font-semibold">
                      {app.missions?.category?.[0]}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-sm truncate">{app.missions?.title}</p>
                  <p className="text-sand-500 text-xs">
                    {app.missions?.producer_accounts?.company_name ?? app.missions?.profiles?.full_name}
                    {" · "}
                    {timeAgo(app.created_at)}
                  </p>
                </div>
                <span className={`badge ${APPLICATION_STATUS_BADGE[app.status as ApplicationStatus]}`}>
                  {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + New missions */}
        <div className="flex flex-col gap-6">
          {/* Quick actions */}
          <div>
            <h2 className="font-semibold text-ink mb-4">Actions rapides</h2>
            <div className="flex flex-col gap-2">
              {[
                { href: "/face/profil",  icon: User,   label: "Modifier mon profil",  sub: "Bio, compétences, contact" },
                { href: "/face/galerie", icon: Images,  label: "Gérer ma galerie",     sub: "Photos et vidéos" },
                { href: "/face/missions",icon: Search,  label: "Explorer les missions", sub: `${missions?.length ?? 0} nouvelles` },
              ].map(({ href, icon: Icon, label, sub }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-em-50 transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-em-100 flex items-center justify-center flex-shrink-0 group-hover:bg-em-200 transition-colors">
                    <Icon size={16} className="text-em-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm">{label}</p>
                    <p className="text-sand-400 text-xs">{sub}</p>
                  </div>
                  <ArrowRight size={14} className="text-sand-300 ml-auto group-hover:text-em-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* New missions preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-ink text-sm">Nouvelles missions</h2>
              <Link href="/face/missions" className="text-xs text-em-600 hover:text-em-400 transition-colors">Tout voir</Link>
            </div>
            <div className="flex flex-col gap-2">
              {(missions ?? []).slice(0, 3).map((m: any) => (
                <Link key={m.id} href={`/missions/${m.id}`}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-em-50 transition-colors group">
                  <div className="w-2 h-2 rounded-full bg-em-400 mt-2 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm truncate group-hover:text-em-700 transition-colors">{m.title}</p>
                    <p className="text-sand-400 text-xs">{m.category} · {m.location ?? "Gabon"}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
