import { createAdminClient } from "@/lib/supabase/admin";
import { Users, FileText, Briefcase, Flag, CheckCircle2, Clock } from "lucide-react";
import { formatDate, timeAgo } from "@/lib/utils";

export default async function AdminDashboard() {
  const admin = createAdminClient();

  const [
    { count: totalUsers },
    { count: totalFaces },
    { count: totalProducers },
    { count: totalMissions },
    { count: totalApplications },
    { count: pendingFlags },
    { data: recentFlags },
    { data: pendingVerifications },
    { data: recentMissions },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "talent"),
    admin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "producer"),
    admin.from("missions").select("*", { count: "exact", head: true }),
    admin.from("applications").select("*", { count: "exact", head: true }),
    admin.from("moderation_flags").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("moderation_flags").select("*").eq("status", "pending").order("created_at", { ascending: false }).limit(5),
    admin.from("producer_accounts").select("*, profiles(full_name, created_at)").eq("is_verified", false).order("created_at", { ascending: false }).limit(5),
    admin.from("missions").select("*, profiles(full_name)").order("created_at", { ascending: false }).limit(5),
  ]);

  const stats = [
    { label: "Utilisateurs",    value: totalUsers ?? 0,        sub: `${totalFaces ?? 0} talents · ${totalProducers ?? 0} recruteurs`, icon: Users,       color: "bg-em-50 text-em-700" },
    { label: "Missions",        value: totalMissions ?? 0,     sub: "toutes statuts",                                                  icon: FileText,    color: "bg-blue-50 text-blue-700" },
    { label: "Candidatures",    value: totalApplications ?? 0, sub: "au total",                                                        icon: Briefcase,   color: "bg-purple-50 text-purple-700" },
    { label: "Signalements",    value: pendingFlags ?? 0,       sub: "en attente",                                                      icon: Flag,        color: "bg-red-50 text-red-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-8">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Administration</p>
        <h1 className="font-heading text-3xl text-ink">Vue d'ensemble</h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={18} />
            </div>
            <p className="font-heading text-3xl text-ink">{value.toLocaleString("fr-FR")}</p>
            <p className="font-medium text-ink text-sm mt-0.5">{label}</p>
            <p className="text-sand-400 text-xs mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending verifications */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-ink">Vérifications en attente</h2>
            <a href="/admin/verification" className="text-sm text-em-600 hover:text-em-700">Voir tout →</a>
          </div>
          {(pendingVerifications ?? []).length === 0 ? (
            <div className="flex items-center gap-2 text-sand-500 text-sm py-6 justify-center">
              <CheckCircle2 size={16} className="text-em-400" />
              Aucune vérification en attente
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(pendingVerifications ?? []).map((pv: any) => (
                <div key={pv.id} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink text-sm">{pv.company_name}</p>
                    <p className="text-sand-400 text-xs">{pv.profiles?.full_name} · {timeAgo(pv.created_at)}</p>
                  </div>
                  <a href={`/admin/verification?id=${pv.id}`} className="badge badge-pending text-xs hover:opacity-80">
                    À vérifier
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent flags */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-ink">Signalements récents</h2>
            <a href="/admin/signalements" className="text-sm text-em-600 hover:text-em-700">Voir tout →</a>
          </div>
          {(recentFlags ?? []).length === 0 ? (
            <div className="flex items-center gap-2 text-sand-500 text-sm py-6 justify-center">
              <CheckCircle2 size={16} className="text-em-400" />
              Aucun signalement en attente
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {(recentFlags ?? []).map((flag: any) => (
                <div key={flag.id} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-ink text-sm">{flag.reason}</p>
                    <p className="text-sand-400 text-xs capitalize">{flag.target_table} · {timeAgo(flag.created_at)}</p>
                  </div>
                  <span className="badge badge-pending flex-shrink-0">En attente</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent missions */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg text-ink">Dernières missions</h2>
            <a href="/admin/missions" className="text-sm text-em-600 hover:text-em-700">Voir tout →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left text-sand-500 font-medium pb-2 pr-4">Mission</th>
                  <th className="text-left text-sand-500 font-medium pb-2 pr-4">Recruteur</th>
                  <th className="text-left text-sand-500 font-medium pb-2 pr-4">Statut</th>
                  <th className="text-left text-sand-500 font-medium pb-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {(recentMissions ?? []).map((m: any) => (
                  <tr key={m.id}>
                    <td className="py-2.5 pr-4 font-medium text-ink truncate max-w-xs">{m.title}</td>
                    <td className="py-2.5 pr-4 text-sand-500">{m.profiles?.full_name}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`badge badge-${m.status}`}>{m.status}</span>
                    </td>
                    <td className="py-2.5 text-sand-400 text-xs">{timeAgo(m.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
