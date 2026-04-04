import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { createClient } from "@/lib/supabase/server";
import { formatXAF } from "@/lib/utils";

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

export default async function MissionsSection() {
  const supabase = await createClient();

  const { data: missions } = await supabase
    .from("missions")
    .select(`id, title, category, location, is_remote, budget_min, budget_max, currency, deadline, status, required_skills,
      profiles ( full_name, producer_accounts ( company_name, is_verified ) )`)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <section id="missions" className="section-padding" style={{ background: "#f5f4f0", color: "#030f0a" }}>
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">Casting ouverts</span>
            <h2 className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-ink" style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}>
              Missions <em style={{ fontStyle: "italic", color: "#1a9958" }}>en cours</em>
            </h2>
            <p className="font-body font-300 text-[1rem] leading-[1.75] mt-3 max-w-xl" style={{ color: "#3a3832" }}>
              Des centaines d'opportunités professionnelles, mises à jour chaque jour.
            </p>
          </div>
          <Link
            href="/missions"
            className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-em-700 hover:gap-3 transition-all duration-250 shrink-0"
          >
            Toutes les missions
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* Cards */}
        {!missions || missions.length === 0 ? (
          <div className="text-center py-20 font-body" style={{ color: "rgba(3,15,10,0.35)" }}>
            Aucune mission disponible pour le moment.
          </div>
        ) : (
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <StaggerItem key={mission.id}>
                  <Link
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
                      <h3 className="font-heading font-600 text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em] group-hover:text-em-700 transition-colors duration-200">
                        {mission.title}
                      </h3>
                      <p className="font-body text-[0.8125rem] font-300 mt-1" style={{ color: "#9a9890" }}>
                        {brandName}
                      </p>
                    </div>

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
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}

        {/* Bottom CTA */}
        <AnimatedSection delay={0.3} className="text-center mt-14">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl" style={{ background: "#063d1e" }}>
            <p className="font-body text-[1rem] text-white/80 font-400">
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
        </AnimatedSection>
      </div>
    </section>
  );
}