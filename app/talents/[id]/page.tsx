import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { initials, formatDate, storageUrl } from "@/lib/utils";
import { MapPin, CheckCircle2, Globe, Phone, ChevronLeft, ImageIcon } from "lucide-react";
import { STATIC_TALENTS } from "@/lib/data/talents";

export default async function PublicTalentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // ID numérique = talent statique de la homepage → page coquille
  const numericId = Number(id);
  if (!isNaN(numericId) && Number.isInteger(numericId)) {
    const staticTalent = STATIC_TALENTS.find((t) => t.id === numericId);
    if (!staticTalent) notFound();
    return <TalentShell talent={staticTalent!} />;
  }

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
    .eq("talent_id", id)
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

// ─── Coquille pour les talents statiques de la homepage ──────────────────────
import type { StaticTalent } from "@/lib/data/talents";

function TalentShell({ talent }: { talent: StaticTalent }) {
  return (
    <div style={{ minHeight: "100vh", background: "#030f0a" }}>
      {/* Nav */}
      <div
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(3,15,10,0.92)", backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 1.25rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--f-heading, 'Cormorant Garamond', serif)", fontSize: "1.125rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
              E.<span style={{ color: "#26d07c" }}>Talent</span>
            </span>
          </Link>
          <Link
            href="/connexion"
            style={{
              fontFamily: "var(--f-mono, 'DM Mono', monospace)", fontSize: "0.6875rem",
              letterSpacing: "0.12em", textTransform: "uppercase",
              background: "#26d07c", color: "#030f0a", fontWeight: 500,
              padding: "0.5rem 1.25rem", borderRadius: 9999, textDecoration: "none",
            }}
          >
            Se connecter
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.25rem" }}>
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontFamily: "var(--f-mono, 'DM Mono', monospace)", fontSize: "0.6875rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: "2rem",
          }}
        >
          <ChevronLeft size={14} />
          Retour
        </Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
          {/* Card identité */}
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flexWrap: "wrap" }}>
            {/* Photo */}
            <div style={{ width: 120, height: 160, borderRadius: 16, overflow: "hidden", flexShrink: 0, position: "relative", background: "#071a10" }}>
              <Image
                src={talent.image}
                alt={talent.name}
                fill
                style={{ objectFit: "cover" }}
                sizes="120px"
              />
            </div>

            {/* Infos */}
            <div style={{ flex: 1, minWidth: 200 }}>
              <span
                style={{
                  fontFamily: "var(--f-mono, 'DM Mono', monospace)", fontSize: "0.625rem",
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#26d07c", display: "block", marginBottom: "0.5rem",
                }}
              >
                Talent vérifié
              </span>
              <h1
                style={{
                  fontFamily: "var(--f-heading, 'Cormorant Garamond', serif)",
                  fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 600,
                  color: "#fff", lineHeight: 1.1, letterSpacing: "-0.02em",
                  margin: "0 0 0.375rem",
                }}
              >
                {talent.name}
              </h1>
              <p style={{ fontFamily: "var(--f-body, 'DM Sans', sans-serif)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.5)", margin: "0 0 0.75rem" }}>
                {talent.role}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                <span style={{ fontFamily: "var(--f-body, 'DM Sans', sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)" }}>
                  {talent.city}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: "1rem" }}>
                {talent.specialty.split(", ").map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--f-mono, 'DM Mono', monospace)", fontSize: "0.5625rem",
                      letterSpacing: "0.1em", textTransform: "uppercase",
                      padding: "0.25rem 0.75rem", borderRadius: 9999,
                      background: "rgba(38,208,124,0.12)", color: "#7de8b4",
                      border: "1px solid rgba(38,208,124,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bandeau "profil en construction" */}
          <div
            style={{
              borderRadius: 16, padding: "2rem",
              background: "rgba(38,208,124,0.05)",
              border: "1px solid rgba(38,208,124,0.15)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--f-heading, 'Cormorant Garamond', serif)",
                fontSize: "1.375rem", fontWeight: 600, color: "#fff",
                letterSpacing: "-0.01em", marginBottom: "0.5rem",
              }}
            >
              Profil en cours de construction
            </p>
            <p style={{ fontFamily: "var(--f-body, 'DM Sans', sans-serif)", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "1.5rem" }}>
              Ce talent rejoint bientôt la plateforme. Inscris-toi pour être notifié.
            </p>
            <Link
              href="/inscription"
              style={{
                display: "inline-block",
                fontFamily: "var(--f-mono, 'DM Mono', monospace)", fontSize: "0.6875rem",
                letterSpacing: "0.12em", textTransform: "uppercase",
                background: "#26d07c", color: "#030f0a", fontWeight: 500,
                padding: "0.625rem 1.5rem", borderRadius: 9999, textDecoration: "none",
              }}
            >
              Rejoindre E.Talent
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
