import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { initials, formatDate, storageUrl } from "@/lib/utils";
import { MapPin, CheckCircle2, Globe, Phone, ChevronLeft, ImageIcon } from "lucide-react";

export default async function PublicTalentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Fetch talent profile
  const { data: talent } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "talent")
    .single();

  if (!talent) notFound();

  // Check visibility
  let userRole: string | null = null;
  if (user) {
    const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    userRole = p?.role ?? null;
  }

  if (talent.visibility === "private") {
    // Only the talent themselves can see it
    if (!user || user.id !== id) notFound();
  }
  if (talent.visibility === "producers_only") {
    if (!user || userRole !== "producer") notFound();
  }

  // Fetch media
  const { data: media } = await supabase
    .from("media_assets")
    .select("*")
    .eq("face_id", id)
    .eq("media_type", "photo")
    .order("sort_order");

  const backHref = userRole === "producer" ? `/recruteur/talents` : "/";

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Nav */}
      <div className="border-b border-[var(--border)] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-em-900 flex items-center justify-center">
              <span className="font-heading font-semibold text-white text-xs">E</span>
            </div>
            <span className="font-heading text-lg font-semibold text-ink">
              E.<span className="text-em-500">Talent</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href={userRole === "talent" ? "/talent" : "/recruteur"} className="btn btn-outline btn-sm">
                Tableau de bord
              </Link>
            ) : (
              <Link href="/connexion" className="btn btn-em btn-sm">Se connecter</Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href={backHref}
          className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink transition-colors mb-6">
          <ChevronLeft size={15} />
          {userRole === "producer" ? "Catalogue talents" : "Accueil"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar: identity */}
          <div className="flex flex-col gap-4">
            <div className="card p-6 text-center">
              <div className="relative w-24 h-24 rounded-full bg-em-100 mx-auto mb-4 overflow-hidden ring-4 ring-em-100">
                {talent.avatar_url ? (
                  <Image src={talent.avatar_url} alt={talent.full_name} fill className="object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center font-heading text-em-700 text-3xl font-semibold">
                    {initials(talent.full_name)}
                  </span>
                )}
              </div>
              <h1 className="font-heading text-xl text-ink mb-1">{talent.full_name}</h1>
              {talent.city && (
                <p className="text-sand-500 text-sm flex items-center justify-center gap-1 mb-3">
                  <MapPin size={13} />{talent.city}
                </p>
              )}
              <span className={`badge ${talent.is_available ? "badge-accepted" : "badge-sand"}`}>
                {talent.is_available ? "Disponible" : "Indisponible"}
              </span>
            </div>

            {/* Details */}
            <div className="card p-5">
              <p className="text-sand-500 text-xs font-medium uppercase tracking-wide mb-3">Infos</p>
              <dl className="flex flex-col gap-2.5 text-sm">
                {talent.gender && (
                  <div className="flex justify-between">
                    <dt className="text-sand-500">Genre</dt>
                    <dd className="text-ink capitalize">{talent.gender}</dd>
                  </div>
                )}
                {talent.birth_date && (
                  <div className="flex justify-between">
                    <dt className="text-sand-500">Naissance</dt>
                    <dd className="text-ink">{formatDate(talent.birth_date, { month: "long", year: "numeric" })}</dd>
                  </div>
                )}
                {talent.height_cm && (
                  <div className="flex justify-between">
                    <dt className="text-sand-500">Taille</dt>
                    <dd className="text-ink">{talent.height_cm} cm</dd>
                  </div>
                )}
                {(talent.languages ?? []).length > 0 && (
                  <div>
                    <dt className="text-sand-500 mb-1">Langues</dt>
                    <dd className="flex flex-wrap gap-1">
                      {(talent.languages as string[]).map((l) => (
                        <span key={l} className="badge badge-sand text-xs">{l}</span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Contact — only for producers */}
            {userRole === "producer" && talent.phone && (
              <div className="card p-5">
                <p className="text-sand-500 text-xs font-medium uppercase tracking-wide mb-3">Contact</p>
                <a href={`tel:${talent.phone}`}
                  className="flex items-center gap-2 text-sm text-ink hover:text-em-700 transition-colors">
                  <Phone size={14} className="text-sand-400" />
                  {talent.phone}
                </a>
              </div>
            )}
          </div>

          {/* Main: bio, skills, gallery */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {talent.bio && (
              <div className="card p-6">
                <h2 className="font-heading text-lg text-ink mb-3">À propos</h2>
                <p className="text-sand-600 leading-relaxed whitespace-pre-line">{talent.bio}</p>
              </div>
            )}

            {(talent.skills ?? []).length > 0 && (
              <div className="card p-6">
                <h2 className="font-heading text-lg text-ink mb-3">Compétences</h2>
                <div className="flex flex-wrap gap-2">
                  {(talent.skills as string[]).map((s) => (
                    <span key={s} className="badge badge-em">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Photo gallery */}
            {(media ?? []).length > 0 ? (
              <div className="card p-6">
                <h2 className="font-heading text-lg text-ink mb-4">Galerie photos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(media ?? []).map((asset: any) => {
                    const url = storageUrl("media", asset.url) ?? asset.url;
                    return (
                      <div key={asset.id} className="aspect-square rounded-xl overflow-hidden bg-sand-100 relative">
                        <Image src={url} alt={asset.caption ?? "Photo"} fill className="object-cover hover:scale-105 transition-transform duration-300" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="card p-10 text-center">
                <ImageIcon size={28} className="text-sand-300 mx-auto mb-2" />
                <p className="text-sand-500 text-sm">Aucune photo dans la galerie.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
