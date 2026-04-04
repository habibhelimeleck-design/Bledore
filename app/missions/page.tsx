import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatXAF } from "@/lib/utils";
import NavBar from "@/components/home/NavBar";
import FooterSection from "@/components/home/FooterSection";

function daysLeft(deadline: string | null): string {
  if (!deadline) return "Sans délai";
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (diff < 0)  return "Expiré";
  if (diff === 0) return "Dernier jour";
  if (diff === 1) return "1 jour restant";
  return `${diff} jours restants`;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Publicité":               "bg-forest-100 text-forest-700",
  "Clip musical":            "bg-purple-50 text-purple-700",
  "Film / Série":            "bg-blue-50 text-blue-700",
  "Défilé / Mode":           "bg-gold-light/40 text-[#8b6234]",
  "Photographie":            "bg-pink-50 text-pink-700",
  "Contenu réseaux sociaux": "bg-orange-50 text-orange-700",
  "Voix off":                "bg-blue-50 text-blue-700",
  "Événement":               "bg-green-50 text-green-700",
};

export default async function MissionsPage() {
  const supabase = await createClient();

  const { data: missions } = await supabase
    .from("missions")
    .select(`id, title, category, location, is_remote, budget_min, budget_max, currency, deadline, status, required_skills, description,
      profiles ( full_name, producer_accounts ( company_name, is_verified ) )`)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <>
      <NavBar />
      <main className="min-h-screen pt-[72px]" style={{ background: "#f5f4f0" }}>
        {/* Hero header */}
        <div className="py-16" style={{ background: "#030f0a" }}>
          <div className="container-xl">
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-400 mb-4 block">Casting ouverts</span>
            <h1
              className="font-heading font-600 text-white mb-4"
              style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)", lineHeight: 1.0, letterSpacing: "-0.02em" }}
            >
              Toutes les <em style={{ fontStyle: "italic", color: "#26d07c" }}>missions</em>
            </h1>
            <p className="font-body font-300 text-[1rem]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {missions?.length ?? 0} opportunité{(missions?.length ?? 0) > 1 ? "s" : ""} disponible{(missions?.length ?? 0) > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Missions grid */}
        <div className="container-xl py-16">
          {!missions || missions.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "rgba(38,208,124,0.08)", border: "1px solid rgba(38,208,124,0.15)" }}>
                <Search size={24} style={{ color: "#26d07c" }} />
              </div>
              <h2 className="font-heading font-600 text-ink text-2xl mb-3">Aucune mission disponible</h2>
              <p className="font-body text-[0.9375rem]" style={{ color: "#9a9890" }}>
                Revenez bientôt — de nouvelles opportunités sont publiées chaque jour.
              </p>
              <Link
                href="/inscription/recruteur"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full font-600 text-[0.875rem] bg-em-400 text-ink hover:bg-em-300 transition-all duration-300"
              >
                Publier un casting
                <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {missions.map((mission: any) => {
                const producer = (mission.profiles as any)?.producer_accounts;
                const brandName = producer?.company_name ?? (mission.profiles as any)?.full_name ?? "Recruteur";
                const budget = mission.budget_min && mission.budget_max
                  ? `${formatXAF(mission.budget_min)} – ${formatXAF(mission.budget_max)}`
                  : mission.budget_min ? formatXAF(mission.budget_min)
                  : "Budget à négocier";
                const locationLabel = mission.is_remote ? "Télétravail possible" : (mission.location ?? "Gabon");
                const deadline = daysLeft(mission.deadline);
                const isUrgent = mission.deadline
                  ? Math.ceil((new Date(mission.deadline).getTime() - Date.now()) / 86_400_000) <= 3
                  : false;

                return (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="group flex flex-col gap-4 p-6 rounded-2xl bg-white transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                    style={{ border: "1px solid #e8e6df" }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${CATEGORY_COLORS[mission.category] ?? "bg-gray-50 text-gray-600"}`}>
                          {mission.category}
                        </span>
                        {isUrgent && (
                          <span className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ background: "#fff4e6", color: "#c45c00", border: "1px solid #ffd8a8" }}>
                            Urgent
                          </span>
                        )}
                      </div>
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-45"
                        style={{ border: "1px solid #e8e6df", color: "#9a9890" }}
                      >
                        <ArrowRight size={14} aria-hidden="true" />
                      </div>
                    </div>

                    {/* Title & brand */}
                    <div>
                      <h2 className="font-heading font-600 text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em] group-hover:text-em-700 transition-colors duration-200">
                        {mission.title}
                      </h2>
                      <p className="font-body text-[0.8125rem] font-300 mt-1" style={{ color: "#9a9890" }}>
                        {brandName}
                      </p>
                    </div>

                    {/* Description excerpt */}
                    {mission.description && (
                      <p className="font-body text-[0.875rem] font-300 leading-[1.6] line-clamp-2" style={{ color: "#6b6560" }}>
                        {mission.description}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                        <MapPin size={13} aria-hidden="true" />
                        <span className="font-mono text-[0.75rem] tracking-[0.04em]">{locationLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: "#0d6637" }}>
                        <Banknote size={13} aria-hidden="true" />
                        <span className="font-mono text-[0.75rem] tracking-[0.04em]">{budget}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                        <Clock size={13} aria-hidden="true" />
                        <span className="font-body text-xs">{deadline}</span>
                      </div>
                    </div>

                    {/* Skills tags */}
                    {mission.required_skills && mission.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: "1px solid #e8e6df" }}>
                        {(mission.required_skills as string[]).slice(0, 3).map((tag: string) => (
                          <span key={tag} className="font-mono text-[0.6875rem] tracking-[0.04em] px-2 py-0.5 rounded-full" style={{ background: "#f5f4f0", color: "#9a9890" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}

          {/* CTA recruteur */}
          <div className="mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl" style={{ background: "#063d1e" }}>
              <p className="font-body text-[1rem] text-white/80">
                Vous êtes recruteur ou marque ?
              </p>
              <Link
                href="/inscription/recruteur"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-600 text-[0.875rem] bg-em-400 text-ink hover:bg-em-300 transition-all duration-300 shrink-0"
              >
                Publier un casting gratuit
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </>
  );
}