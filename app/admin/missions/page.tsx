import { createAdminClient } from "@/lib/supabase/admin";
import { MISSION_STATUS_LABELS, MISSION_STATUS_BADGE, timeAgo, formatXAF } from "@/lib/utils";
import type { MissionStatus } from "@/lib/types/database";
import { FileText } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>;
}

export default async function AdminMissionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const admin  = createAdminClient();

  let query = admin
    .from("missions")
    .select("*, profiles(full_name), producer_accounts(company_name)")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);
  if (params.q)      query = query.ilike("title", `%${params.q}%`);

  const { data: missions } = await query;

  const ALL_STATUSES: MissionStatus[] = ["published", "draft", "closed", "archived"];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-heading text-3xl text-ink">Missions</h1>
        <p className="text-sand-500 text-sm mt-1">{(missions ?? []).length} missions</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <form className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="form-label text-xs">Titre</label>
            <input name="q" className="form-input py-2 text-sm" placeholder="Rechercher…" defaultValue={params.q ?? ""} />
          </div>
          <div className="w-40">
            <label className="form-label text-xs">Statut</label>
            <select name="status" className="form-input form-select py-2 text-sm" defaultValue={params.status ?? ""}>
              <option value="">Tous</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>{MISSION_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-em py-2.5 text-sm">Filtrer</button>
        </form>
      </div>

      {(missions ?? []).length === 0 ? (
        <div className="card p-16 text-center">
          <FileText size={28} className="text-sand-300 mx-auto mb-3" />
          <p className="text-sand-500 text-sm">Aucune mission trouvée.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand-50 border-b border-[var(--border)]">
              <tr>
                <th className="text-left text-sand-500 font-medium px-4 py-3">Mission</th>
                <th className="text-left text-sand-500 font-medium px-4 py-3">Recruteur</th>
                <th className="text-left text-sand-500 font-medium px-4 py-3">Budget</th>
                <th className="text-left text-sand-500 font-medium px-4 py-3">Statut</th>
                <th className="text-left text-sand-500 font-medium px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {(missions ?? []).map((m: any) => (
                <tr key={m.id} className="hover:bg-sand-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-ink">{m.title}</p>
                      <p className="text-sand-400 text-xs">{m.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sand-500">
                    {m.producer_accounts?.company_name ?? m.profiles?.full_name}
                  </td>
                  <td className="px-4 py-3 text-sand-500">
                    {m.budget_min ? formatXAF(m.budget_min) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${MISSION_STATUS_BADGE[m.status as MissionStatus]}`}>
                      {MISSION_STATUS_LABELS[m.status as MissionStatus]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sand-400 text-xs">{timeAgo(m.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
