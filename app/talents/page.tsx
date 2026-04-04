import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { storageUrl, initials } from "@/lib/utils";
import { MapPin, Star, Verified, ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Catalogue des talents | E.Talent",
  description: "Découvrez tous les talents vérifiés disponibles sur E.Talent.",
};

export default async function TalentsPage() {
  const supabase = await createClient();

  const { data: talents } = await supabase
    .from("profiles")
    .select("id, full_name, role, city, country, visibility, is_available, avatar_url, bio, specialty")
    .eq("role", "talent")
    .eq("visibility", "public")
    .order("full_name");

  return (
    <main style={{ background: "#030f0a", minHeight: "100vh" }}>
      {/* Nav top */}
      <div
        className="sticky top-0 z-50 flex items-center gap-4 px-5 py-4"
        style={{ background: "rgba(3,15,10,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          <ArrowLeft size={14} />
          Accueil
        </Link>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
        <span
          className="font-heading font-600 text-white"
          style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
        >
          E.<span style={{ color: "#26d07c" }}>Talent</span>
        </span>
      </div>

      <div className="px-5 py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <span
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase mb-4 block"
            style={{ color: "#26d07c" }}
          >
            Catalogue talents
          </span>
          <h1
            className="font-heading font-600 text-white leading-[1.0] tracking-[-0.02em]"
            style={{ fontSize: "clamp(2.25rem,5vw,4rem)" }}
          >
            Tous nos{" "}
            <em className="italic" style={{ fontStyle: "italic", color: "#1a9958" }}>
              talents
            </em>
          </h1>
          {talents && talents.length > 0 && (
            <p className="font-body mt-3" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.9375rem" }}>
              {talents.length} talent{talents.length > 1 ? "s" : ""} disponible{talents.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Grid */}
        {!talents || talents.length === 0 ? (
          <div
            className="text-center py-24 font-body"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Aucun talent disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {talents.map((talent) => {
              const avatarUrl = storageUrl("avatars", talent.avatar_url);
              return (
                <Link
                  key={talent.id}
                  href={`/talents/${talent.id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl"
                  aria-label={`Voir le profil de ${talent.full_name}`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={`Portrait de ${talent.full_name}`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center font-heading font-600 text-2xl"
                        style={{ background: "#071a10", color: "#26d07c" }}
                      >
                        {initials(talent.full_name)}
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0"
                      style={{ background: "linear-gradient(to top, rgba(3,15,10,0.95) 0%, rgba(3,15,10,0.2) 50%, transparent 75%)" }}
                    />

                    {/* Available badge */}
                    {talent.is_available && (
                      <div
                        className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full"
                        style={{ background: "#26d07c", boxShadow: "0 0 6px rgba(38,208,124,0.6)" }}
                        title="Disponible"
                      />
                    )}

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h2
                        className="font-heading font-600 text-white leading-[1.2] tracking-[-0.01em] mb-0.5"
                        style={{ fontSize: "clamp(0.9rem,3vw,1.125rem)" }}
                      >
                        {talent.full_name}
                      </h2>
                      {talent.specialty && (
                        <p
                          className="font-body text-[0.75rem] font-300 truncate"
                          style={{ color: "rgba(255,255,255,0.5)" }}
                        >
                          {String(talent.specialty)}
                        </p>
                      )}
                      {talent.city && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
                          <span className="font-body text-[0.6875rem]" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {talent.city}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}