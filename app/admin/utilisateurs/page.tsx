import { createAdminClient } from "@/lib/supabase/admin";
import { initials, timeAgo } from "@/lib/utils";
import { Users } from "lucide-react";

interface Props {
  searchParams: Promise<{ role?: string; q?: string }>;
}

export default async function AdminUsersPage({ searchParams }: Props) {
  const params = await searchParams;
  const admin  = createAdminClient();

  let query = admin.from("profiles")
    .select("*, producer_accounts(company_name, is_verified)")
    .order("created_at", { ascending: false });

  if (params.role) query = query.eq("role", params.role);
  if (params.q)    query = query.ilike("full_name", `%${params.q}%`);

  const { data: users } = await query;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-heading text-3xl text-ink">Utilisateurs</h1>
        <p className="text-sand-500 text-sm mt-1">{(users ?? []).length} utilisateurs</p>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <form className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="form-label text-xs">Nom</label>
            <input name="q" className="form-input py-2 text-sm" placeholder="Rechercher…" defaultValue={params.q ?? ""} />
          </div>
          <div className="w-36">
            <label className="form-label text-xs">Rôle</label>
            <select name="role" className="form-input form-select py-2 text-sm" defaultValue={params.role ?? ""}>
              <option value="">Tous</option>
              <option value="face">Talents</option>
              <option value="producer">Recruteurs</option>
            </select>
          </div>
          <button type="submit" className="btn btn-em py-2.5 text-sm">Filtrer</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sand-50 border-b border-[var(--border)]">
            <tr>
              <th className="text-left text-sand-500 font-medium px-4 py-3">Utilisateur</th>
              <th className="text-left text-sand-500 font-medium px-4 py-3">Rôle</th>
              <th className="text-left text-sand-500 font-medium px-4 py-3">Ville</th>
              <th className="text-left text-sand-500 font-medium px-4 py-3">Statut</th>
              <th className="text-left text-sand-500 font-medium px-4 py-3">Inscrit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {(users ?? []).length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sand-500">Aucun utilisateur trouvé</td>
              </tr>
            ) : (users ?? []).map((u: any) => (
              <tr key={u.id} className="hover:bg-sand-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-em-100 flex items-center justify-center flex-shrink-0 text-em-700 font-semibold text-xs">
                      {initials(u.full_name)}
                    </div>
                    <div>
                      <p className="font-medium text-ink">{u.full_name}</p>
                      {u.producer_accounts?.company_name && (
                        <p className="text-sand-400 text-xs">{u.producer_accounts.company_name}</p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${u.role === "face" ? "badge-em" : "badge-gold"}`}>
                    {u.role === "face" ? "Talent" : "Recruteur"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sand-500">{u.city ?? "—"}</td>
                <td className="px-4 py-3">
                  {u.role === "producer" ? (
                    <span className={`badge ${u.producer_accounts?.is_verified ? "badge-accepted" : "badge-pending"}`}>
                      {u.producer_accounts?.is_verified ? "Vérifié" : "Non vérifié"}
                    </span>
                  ) : (
                    <span className={`badge ${u.is_available ? "badge-accepted" : "badge-sand"}`}>
                      {u.is_available ? "Disponible" : "Indisponible"}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-sand-400 text-xs">{timeAgo(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
