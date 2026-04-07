export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { initials, formatDate, storageUrl } from "@/lib/utils";
import {
  MapPin, ChevronLeft, ImageIcon,
  Instagram, Youtube, Facebook, Twitter,
  Phone, CheckCircle2, Star,
} from "lucide-react";
import type { TalentSocials } from "@/lib/types/database";

/* ── Helpers ────────────────────────────────────────────── */
function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function totalFollowers(socials: TalentSocials | null): number {
  if (!socials) return 0;
  return (
    (socials.instagram?.followers ?? 0) +
    (socials.tiktok?.followers ?? 0) +
    (socials.youtube?.subscribers ?? 0) +
    (socials.facebook?.followers ?? 0) +
    (socials.twitter?.followers ?? 0)
  );
}

const SOCIAL_META: Record<
  keyof TalentSocials,
  { label: string; color: string; bg: string; icon: React.ReactNode; followerKey: string }
> = {
  instagram: {
    label: "Instagram",
    color: "#E1306C",
    bg: "rgba(225,48,108,0.1)",
    icon: <Instagram size={18} />,
    followerKey: "followers",
  },
  tiktok: {
    label: "TikTok",
    color: "#ffffff",
    bg: "rgba(255,255,255,0.08)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
    followerKey: "followers",
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    bg: "rgba(255,0,0,0.1)",
    icon: <Youtube size={18} />,
    followerKey: "subscribers",
  },
  facebook: {
    label: "Facebook",
    color: "#1877F2",
    bg: "rgba(24,119,242,0.1)",
    icon: <Facebook size={18} />,
    followerKey: "followers",
  },
  twitter: {
    label: "Twitter / X",
    color: "#ffffff",
    bg: "rgba(255,255,255,0.08)",
    icon: <Twitter size={18} />,
    followerKey: "followers",
  },
};

/* ── Page ─────────────────────────────────────────────────── */
export default async function PublicTalentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: talent } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "talent")
    .single();

  if (!talent) notFound();

  /* Visibility guard */
  let userRole: string | null = null;
  if (user) {
    const { data: p } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    userRole = p?.role ?? null;
  }
  if (talent.visibility === "private" && (!user || user.id !== id)) notFound();
  if (talent.visibility === "producers_only" && (!user || userRole !== "producer")) notFound();

  /* Media */
  const { data: media } = await supabase
    .from("media_assets")
    .select("*")
    .eq("talent_id", id)
    .eq("media_type", "photo")
    .order("sort_order");

  const socials = talent.socials as TalentSocials | null;
  const skills  = talent.skills as string[] | null;
  const langs   = talent.languages as string[] | null;
  const total   = totalFollowers(socials);
  const backHref = userRole === "producer" ? "/recruteur/talents" : "/";
  const socialEntries = Object.entries(socials ?? {}).filter(
    ([, v]) => v && (v as { url?: string }).url
  ) as [keyof TalentSocials, { url: string; followers?: number; subscribers?: number }][];

  return (
    <div style={{ minHeight: "100vh", background: "#030f0a" }}>

      {/* ── Nav ─────────────────────────────────────────── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(3,15,10,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontFamily: "var(--f-heading,'Cormorant Garamond',serif)", fontSize: "1.125rem", fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>
              E.<span style={{ color: "#26d07c" }}>Talent</span>
            </span>
          </Link>
          <div style={{ display: "flex", gap: 10 }}>
            {user ? (
              <Link href={userRole === "talent" ? "/talent" : "/recruteur"}
                style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", padding: "0.5rem 1.25rem", borderRadius: 9999, textDecoration: "none" }}>
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link href="/connexion"
                  style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", padding: "0.5rem 1.25rem", borderRadius: 9999, textDecoration: "none" }}>
                  Connexion
                </Link>
                <Link href="/inscription"
                  style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", background: "#26d07c", color: "#030f0a", fontWeight: 500, padding: "0.5rem 1.25rem", borderRadius: 9999, textDecoration: "none" }}>
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>

        {/* Retour */}
        <Link href={backHref} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", textDecoration: "none", marginBottom: "2.5rem" }}>
          <ChevronLeft size={14} />
          {userRole === "producer" ? "Catalogue talents" : "Accueil"}
        </Link>

        {/* ── Hero header ─────────────────────────────────── */}
        <div style={{
          borderRadius: 24,
          background: "linear-gradient(135deg, #071a10 0%, #030f0a 60%, #0a1f12 100%)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "2.5rem",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Radial glow */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(38,208,124,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start", flexWrap: "wrap", position: "relative" }}>
            {/* Avatar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", overflow: "hidden", background: "#0d2d1a", border: "3px solid rgba(38,208,124,0.25)" }}>
                {talent.avatar_url ? (
                  <Image src={talent.avatar_url as string} alt={talent.full_name as string} fill style={{ objectFit: "cover" }} sizes="120px" />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontFamily: "var(--f-heading,'Cormorant Garamond',serif)", fontSize: "2.5rem", fontWeight: 600, color: "rgba(38,208,124,0.4)" }}>
                      {initials(talent.full_name as string)}
                    </span>
                  </div>
                )}
              </div>
              {/* Availability dot */}
              {talent.is_available && (
                <div style={{ position: "absolute", bottom: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#26d07c", border: "2px solid #030f0a" }} />
              )}
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 220 }}>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                <span style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#26d07c" }}>
                  Talent
                </span>
                {talent.is_available && (
                  <span style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.5625rem", letterSpacing: "0.15em", textTransform: "uppercase", background: "rgba(38,208,124,0.12)", color: "#7de8b4", border: "1px solid rgba(38,208,124,0.2)", padding: "0.15rem 0.6rem", borderRadius: 9999 }}>
                    Disponible
                  </span>
                )}
              </div>

              <h1 style={{ fontFamily: "var(--f-heading,'Cormorant Garamond',serif)", fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 600, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.02em", margin: "0 0 0.375rem" }}>
                {talent.full_name as string}
              </h1>

              {talent.bio && (
                <p style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.45)", margin: "0 0 0.875rem", maxWidth: 480, lineHeight: 1.5 }}>
                  {(talent.bio as string).slice(0, 120)}{(talent.bio as string).length > 120 ? "…" : ""}
                </p>
              )}

              {/* Location */}
              {talent.city && (
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: "1rem" }}>
                  <MapPin size={13} style={{ color: "rgba(255,255,255,0.3)" }} />
                  <span style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)" }}>
                    {talent.city as string}, Gabon
                  </span>
                </div>
              )}

              {/* Skills pills */}
              {skills?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {skills.map((s) => (
                    <span key={s} style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.25rem 0.75rem", borderRadius: 9999, background: "rgba(38,208,124,0.1)", color: "#7de8b4", border: "1px solid rgba(38,208,124,0.18)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Stats column */}
            {total > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--f-heading,'Cormorant Garamond',serif)", fontSize: "2.25rem", fontWeight: 600, color: "#26d07c", lineHeight: 1 }}>
                  {formatFollowers(total)}
                </span>
                <span style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.5625rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Abonnés total
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Content grid ────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>

          {/* ── LEFT: bio + galerie ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Biographie complète */}
            {talent.bio && (
              <div style={{ borderRadius: 20, background: "#071a10", border: "1px solid rgba(255,255,255,0.06)", padding: "1.75rem" }}>
                <p style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                  Biographie
                </p>
                <p style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.9375rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                  {talent.bio as string}
                </p>
              </div>
            )}

            {/* Galerie */}
            <div style={{ borderRadius: 20, background: "#071a10", border: "1px solid rgba(255,255,255,0.06)", padding: "1.75rem" }}>
              <p style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.25rem" }}>
                Réalisations & Galerie
              </p>
              {(media ?? []).length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                  {(media ?? []).map((asset: Record<string, unknown>) => {
                    const url = storageUrl("media", asset.url as string) ?? (asset.url as string);
                    return (
                      <div key={asset.id as string} style={{ aspectRatio: "1", borderRadius: 12, overflow: "hidden", position: "relative", background: "#0d2d1a" }}>
                        <Image src={url} alt={(asset.caption as string) ?? "Photo"} fill style={{ objectFit: "cover", transition: "transform 0.4s" }} sizes="33vw" />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem 0", gap: 12 }}>
                  <ImageIcon size={32} style={{ color: "rgba(255,255,255,0.1)" }} />
                  <p style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.875rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
                    Aucune réalisation pour le moment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

            {/* Réseaux sociaux */}
            {socialEntries.length > 0 && (
              <div style={{ borderRadius: 20, background: "#071a10", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                  Réseaux sociaux
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {socialEntries.map(([key, val]) => {
                    const meta = SOCIAL_META[key];
                    const count = val.followers ?? val.subscribers ?? 0;
                    return (
                      <a key={key} href={val.url} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: 12, padding: "0.75rem 1rem", borderRadius: 12, background: meta.bg, border: "1px solid rgba(255,255,255,0.06)", textDecoration: "none", transition: "opacity 0.2s" }}>
                        <span style={{ color: meta.color, display: "flex", alignItems: "center", flexShrink: 0 }}>
                          {meta.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", fontWeight: 500, color: "#fff", margin: 0 }}>
                            {meta.label}
                          </p>
                        </div>
                        {count > 0 && (
                          <span style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.75rem", color: meta.color, fontWeight: 500, flexShrink: 0 }}>
                            {formatFollowers(count)}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Infos physiques */}
            {(talent.gender || talent.height_cm || talent.birth_date || langs?.length) ? (
              <div style={{ borderRadius: 20, background: "#071a10", border: "1px solid rgba(255,255,255,0.06)", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                  Informations
                </p>
                <dl style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {talent.gender && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)" }}>Genre</dt>
                      <dd style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)", textTransform: "capitalize" }}>{talent.gender as string}</dd>
                    </div>
                  )}
                  {talent.birth_date && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)" }}>Naissance</dt>
                      <dd style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>{formatDate(talent.birth_date as string, { month: "long", year: "numeric" })}</dd>
                    </div>
                  )}
                  {talent.height_cm && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)" }}>Taille</dt>
                      <dd style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.7)" }}>{talent.height_cm as number} cm</dd>
                    </div>
                  )}
                  {langs?.length ? (
                    <div>
                      <dt style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Langues</dt>
                      <dd style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {langs.map((l) => (
                          <span key={l} style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.5625rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.6rem", borderRadius: 9999, background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                            {l}
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            ) : null}

            {/* Contact — recruteurs uniquement */}
            {userRole === "producer" && talent.phone && (
              <div style={{ borderRadius: 20, background: "rgba(38,208,124,0.05)", border: "1px solid rgba(38,208,124,0.15)", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.625rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(38,208,124,0.5)", marginBottom: "0.875rem" }}>
                  Contact
                </p>
                <a href={`tel:${talent.phone as string}`}
                  style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "rgba(255,255,255,0.7)", fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.875rem" }}>
                  <Phone size={14} style={{ color: "#26d07c" }} />
                  {talent.phone as string}
                </a>
              </div>
            )}

            {/* CTA inscription */}
            {!user && (
              <div style={{ borderRadius: 20, background: "rgba(38,208,124,0.05)", border: "1px solid rgba(38,208,124,0.12)", padding: "1.5rem", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--f-heading,'Cormorant Garamond',serif)", fontSize: "1.25rem", fontWeight: 600, color: "#fff", marginBottom: "0.5rem" }}>
                  Recruter ce talent ?
                </p>
                <p style={{ fontFamily: "var(--f-body,'DM Sans',sans-serif)", fontSize: "0.8125rem", color: "rgba(255,255,255,0.35)", marginBottom: "1.25rem" }}>
                  Créez un compte recruteur pour le contacter.
                </p>
                <Link href="/inscription"
                  style={{ display: "inline-block", fontFamily: "var(--f-mono,'DM Mono',monospace)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", background: "#26d07c", color: "#030f0a", fontWeight: 500, padding: "0.625rem 1.5rem", borderRadius: 9999, textDecoration: "none" }}>
                  S'inscrire gratuitement
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}