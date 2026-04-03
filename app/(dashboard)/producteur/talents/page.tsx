import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { GABON_CITIES, TALENT_SKILLS, initials } from "@/lib/utils";
import { Search, MapPin, CheckCircle2, Users } from "lucide-react";

interface Props {
  searchParams: Promise<{ q?: string; city?: string; skill?: string; gender?: string; available?: string }>;
}

export default async function TalentsCatalogPage({ searchParams }: Props) {
  const params   = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  let query = supabase
    .from("profiles")
    .select("id, full_name, avatar_url, bio, city, gender, skills, is_available, visibility")
    .eq("role", "face")
    .in("visibility", ["public", "producers_only"])
    .order("is_available", { ascending: false })
    .order("full_name");

  if (params.city)   query = query.eq("city", params.city);
  if (params.gender) query = query.eq("gender", params.gender);
  if (params.available === "1") query = query.eq("is_available", true);
  if (params.skill)  query = query.contains("skills", [params.skill]);
  if (params.q)      query = query.ilike("full_name", `%${params.q}%`);

  const { data: talents } = await query;

  const hasFilters = params.city || params.skill || params.gender || params.available || params.q;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Rechercher</p>
        <h1 className="font-heading text-h1 text-ink">Catalogue des talents</h1>
        <p className="text-sand-500 text-sm mt-1">{(talents ?? []).length} talent{(talents ?? []).length !== 1 ? "s" : ""} trouvé{(talents ?? []).length !== 1 ? "s" : ""}</p>
      </div>

      {/* Filtres */}
      <div className="card p-4 mb-6">
        <form className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-48">
            <label className="form-label text-xs">Nom</label>
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400" />
              <input name="q" className="form-input pl-9 py-2 text-sm" placeholder="Rechercher un talent…"
                defaultValue={params.q ?? ""} />
            </div>
          </div>
          <div className="w-40">
            <label className="form-label text-xs">Compétence</label>
            <select name="skill" className="form-input form-select py-2 text-sm" defaultValue={params.skill ?? ""}>
              <option value="">Toutes</option>
              {TALENT_SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="w-36">
            <label className="form-label text-xs">Ville</label>
            <select name="city" className="form-input form-select py-2 text-sm" defaultValue={params.city ?? ""}>
              <option value="">Toutes</option>
              {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="w-32">
            <label className="form-label text-xs">Genre</label>
            <select name="gender" className="form-input form-select py-2 text-sm" defaultValue={params.gender ?? ""}>
              <option value="">Tous</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pb-2">
            <input type="checkbox" id="available" name="available" value="1"
              defaultChecked={params.available === "1"}
              className="w-4 h-4 accent-em-600 cursor-pointer" />
            <label htmlFor="available" className="text-sm text-sand-600 cursor-pointer whitespace-nowrap">Disponible</label>
          </div>
          <button type="submit" className="btn btn-em py-2.5 text-sm">Filtrer</button>
          {hasFilters && (
            <Link href="/producteur/talents" className="btn btn-ghost py-2.5 text-sm">Réinitialiser</Link>
          )}
        </form>
      </div>

      {/* Grid */}
      {(talents ?? []).length === 0 ? (
        <div className="card p-16 text-center">
          <Users size={32} className="text-sand-300 mx-auto mb-4" />
          <p className="font-heading text-xl text-ink mb-2">Aucun talent trouvé</p>
          <p className="text-sand-500 text-sm">Modifiez vos filtres pour élargir la recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(talents ?? []).map((talent: any) => (
            <TalentCard key={talent.id} talent={talent} />
          ))}
        </div>
      )}
    </div>
  );
}

function TalentCard({ talent }: { talent: any }) {
  return (
    <Link href={`/talents/${talent.id}`}
      className="card p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 rounded-full bg-em-100 flex-shrink-0 overflow-hidden ring-2 ring-em-100 group-hover:ring-em-300 transition-all">
          {talent.avatar_url ? (
            <Image src={talent.avatar_url} alt={talent.full_name} fill className="object-cover" />
          ) : (
            <span className="w-full h-full flex items-center justify-center font-heading text-em-700 text-lg font-semibold">
              {initials(talent.full_name)}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-ink truncate group-hover:text-em-700 transition-colors">
              {talent.full_name}
            </p>
            {talent.is_available && (
              <CheckCircle2 size={14} className="text-em-500 flex-shrink-0" />
            )}
          </div>
          {talent.city && (
            <p className="text-sand-500 text-xs flex items-center gap-1 mt-0.5">
              <MapPin size={10} />{talent.city}
            </p>
          )}
        </div>
      </div>

      {talent.bio && (
        <p className="text-sand-600 text-sm line-clamp-2 leading-relaxed">{talent.bio}</p>
      )}

      {(talent.skills ?? []).length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {(talent.skills as string[]).slice(0, 3).map((skill) => (
            <span key={skill} className="badge badge-sand text-xs">{skill}</span>
          ))}
          {(talent.skills as string[]).length > 3 && (
            <span className="badge badge-sand text-xs">+{talent.skills.length - 3}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
        <span className={`badge text-xs ${talent.is_available ? "badge-accepted" : "badge-sand"}`}>
          {talent.is_available ? "Disponible" : "Indisponible"}
        </span>
        <span className="text-xs text-em-600 font-medium group-hover:underline">Voir le profil →</span>
      </div>
    </Link>
  );
}
