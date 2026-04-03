import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatXAF, formatDateShort, MISSION_CATEGORIES, GABON_CITIES } from "@/lib/utils";
import { Search, MapPin, Calendar, Banknote } from "lucide-react";

interface Props {
  searchParams: Promise<{ category?: string; city?: string; q?: string }>;
}

export default async function FaceMissionsPage({ searchParams }: Props) {
  const params   = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  let query = supabase.from("missions")
    .select("*, profiles(full_name, producer_accounts(company_name, is_verified))")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (params.category) query = query.eq("category", params.category);
  if (params.city)     query = query.eq("location", params.city);
  if (params.q)        query = query.ilike("title", `%${params.q}%`);

  const { data: missions } = await query;

  // Check which missions user already applied to
  const { data: applications } = await supabase
    .from("applications").select("mission_id").eq("face_id", user.id);
  const appliedIds = new Set((applications ?? []).map((a: any) => a.mission_id));

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Explorer</p>
        <h1 className="font-heading text-h1 text-ink">Missions disponibles</h1>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <form className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="form-label text-xs">Recherche</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input name="q" className="form-input pl-9 py-2 text-sm" placeholder="Titre, mot-clé…"
                defaultValue={params.q ?? ""} />
            </div>
          </div>
          <div className="w-44">
            <label className="form-label text-xs">Catégorie</label>
            <select name="category" className="form-input form-select py-2 text-sm" defaultValue={params.category ?? ""}>
              <option value="">Toutes</option>
              {MISSION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="form-label text-xs">Ville</label>
            <select name="city" className="form-input form-select py-2 text-sm" defaultValue={params.city ?? ""}>
              <option value="">Toutes</option>
              {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-em py-2.5 text-sm">Filtrer</button>
          {(params.category || params.city || params.q) && (
            <Link href="/talent/missions" className="btn btn-ghost py-2.5 text-sm">Réinitialiser</Link>
          )}
        </form>
      </div>

      <p className="text-sand-500 text-sm mb-4">{(missions ?? []).length} mission{(missions ?? []).length > 1 ? "s" : ""} trouvée{(missions ?? []).length > 1 ? "s" : ""}</p>

      <div className="flex flex-col gap-4">
        {(missions ?? []).length === 0 ? (
          <div className="card p-16 text-center">
            <Search size={28} className="text-sand-300 mx-auto mb-3" />
            <p className="font-semibold text-ink">Aucune mission trouvée</p>
            <p className="text-sand-500 text-sm mt-1">Modifiez vos filtres de recherche.</p>
          </div>
        ) : (missions ?? []).map((mission: any) => {
          const applied = appliedIds.has(mission.id);
          return (
            <div key={mission.id} className="card p-5 flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-em-100 flex items-center justify-center flex-shrink-0">
                <span className="font-heading text-em-700 text-lg">{mission.category[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <Link href={`/missions/${mission.id}`}
                      className="font-semibold text-ink hover:text-em-700 transition-colors">
                      {mission.title}
                    </Link>
                    {(mission.profiles as any)?.producer_accounts?.is_verified && (
                      <span className="ml-2 badge badge-em text-xs">✓ Vérifié</span>
                    )}
                  </div>
                  {applied ? (
                    <span className="badge badge-pending flex-shrink-0">Postulé</span>
                  ) : (
                    <Link href={`/missions/${mission.id}`} className="btn btn-em btn-sm flex-shrink-0">
                      Postuler
                    </Link>
                  )}
                </div>
                <p className="text-sand-500 text-sm line-clamp-2 mb-3">{mission.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sand-400">
                  {mission.location && (
                    <span className="flex items-center gap-1"><MapPin size={11} />{mission.location}</span>
                  )}
                  {mission.deadline && (
                    <span className="flex items-center gap-1"><Calendar size={11} />Deadline {formatDateShort(mission.deadline)}</span>
                  )}
                  {mission.budget_min && (
                    <span className="flex items-center gap-1"><Banknote size={11} />{formatXAF(mission.budget_min)}{mission.budget_max ? ` – ${formatXAF(mission.budget_max)}` : "+"}</span>
                  )}
                  {!mission.budget_min && <span className="flex items-center gap-1"><Banknote size={11} />Non rémunéré</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
