"use client";

import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const MISSIONS = [
  {
    id: 1,
    title: "Visage pub nationale — Télévision",
    brand: "Gabon Télécom",
    location: "Libreville",
    budget: "150 000 – 250 000 XAF",
    deadline: "3 jours restants",
    urgent: true,
    tags: ["Acteur/trice", "18-35 ans", "Mixte"],
    category: "Publicité TV",
  },
  {
    id: 2,
    title: "Mannequin catalogue mode printemps 2025",
    brand: "Studio Gabon Mode",
    location: "Libreville + Port-Gentil",
    budget: "80 000 – 120 000 XAF",
    deadline: "7 jours restants",
    urgent: false,
    tags: ["Mannequin", "Femme", "1m65+"],
    category: "Mode",
  },
  {
    id: 3,
    title: "Voix off publicité radio FM",
    brand: "BGFI Bank Gabon",
    location: "Télétravail possible",
    budget: "40 000 – 70 000 XAF",
    deadline: "12 jours restants",
    urgent: false,
    tags: ["Voix", "Français", "Fang"],
    category: "Voix off",
  },
  {
    id: 4,
    title: "Danseurs Afrobeat — Clip musical",
    brand: "Nzalang Records",
    location: "Libreville",
    budget: "60 000 – 100 000 XAF",
    deadline: "5 jours restants",
    urgent: true,
    tags: ["Danseur/se", "Afrobeat", "Energie"],
    category: "Musique",
  },
  {
    id: 5,
    title: "Testimonial produit cosmétique naturel",
    brand: "BeautyGA",
    location: "Libreville",
    budget: "50 000 – 90 000 XAF",
    deadline: "9 jours restants",
    urgent: false,
    tags: ["Femme", "25-45 ans", "Naturel"],
    category: "Cosmétique",
  },
  {
    id: 6,
    title: "Acteur principal web-série GabonStars",
    brand: "AfroContent Studio",
    location: "Owendo",
    budget: "300 000+ XAF",
    deadline: "14 jours restants",
    urgent: false,
    tags: ["Acteur", "Homme", "20-40 ans"],
    category: "Web-série",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  "Publicité TV":  "bg-forest-100 text-forest-700",
  "Mode":          "bg-gold-light/40 text-[#8b6234]",
  "Voix off":      "bg-blue-50 text-blue-700",
  "Musique":       "bg-purple-50 text-purple-700",
  "Cosmétique":    "bg-pink-50 text-pink-700",
  "Web-série":     "bg-forest-50 text-forest-600",
};

export default function MissionsSection() {
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
            aria-label="Voir toutes les missions disponibles"
          >
            Toutes les missions
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* Mission Cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MISSIONS.map((mission) => (
            <StaggerItem key={mission.id}>
              <Link
                href={`/missions/${mission.id}`}
                className="group flex flex-col gap-4 p-6 rounded-2xl bg-white focus-visible:outline-2 focus-visible:outline-em-400 transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]"
                style={{ border: "1px solid #e8e6df" }}
                aria-label={`Mission : ${mission.title} par ${mission.brand}`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${
                        CATEGORY_COLORS[mission.category] ?? "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {mission.category}
                    </span>
                    {mission.urgent && (
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
                    {mission.brand}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                    <MapPin size={13} aria-hidden="true" />
                    <span className="font-mono text-[0.75rem] tracking-[0.04em]">{mission.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "#0d6637" }}>
                    <Banknote size={13} aria-hidden="true" />
                    <span className="font-mono text-[0.75rem] tracking-[0.04em]">{mission.budget}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                    <Clock size={13} aria-hidden="true" />
                    <span className="font-body text-xs">{mission.deadline}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: "1px solid #e8e6df" }}>
                  {mission.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[0.6875rem] tracking-[0.04em] px-2 py-0.5 rounded-full"
                      style={{ background: "#f5f4f0", color: "#9a9890" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>

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
