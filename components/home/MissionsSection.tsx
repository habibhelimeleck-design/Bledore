"use client";

import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight, ChevronRight } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const MISSIONS = [
  {
    id: 1,
    title: "Visage pub nationale — Télévision",
    brand: "Bénin Télécom",
    location: "Cotonou",
    budget: "150 000 – 250 000 XOF",
    deadline: "3 jours restants",
    urgent: true,
    tags: ["Acteur/trice", "18-35 ans", "Mixte"],
    category: "Publicité TV",
  },
  {
    id: 2,
    title: "Mannequin catalogue mode printemps 2025",
    brand: "Studio Benin Mode",
    location: "Cotonou + Porto-Novo",
    budget: "80 000 – 120 000 XOF",
    deadline: "7 jours restants",
    urgent: false,
    tags: ["Mannequin", "Femme", "1m65+"],
    category: "Mode",
  },
  {
    id: 3,
    title: "Voix off publicité radio FM",
    brand: "Gulf Banque Bénin",
    location: "Télétravail possible",
    budget: "40 000 – 70 000 XOF",
    deadline: "12 jours restants",
    urgent: false,
    tags: ["Voix", "Français", "Fon"],
    category: "Voix off",
  },
  {
    id: 4,
    title: "Danseurs Afrobeat — Clip musical",
    brand: "DioLaé Records",
    location: "Cotonou",
    budget: "60 000 – 100 000 XOF",
    deadline: "5 jours restants",
    urgent: true,
    tags: ["Danseur/se", "Afrobeat", "Energie"],
    category: "Musique",
  },
  {
    id: 5,
    title: "Testimonial produit cosmétique naturel",
    brand: "BeautyBJ",
    location: "Cotonou",
    budget: "50 000 – 90 000 XOF",
    deadline: "9 jours restants",
    urgent: false,
    tags: ["Femme", "25-45 ans", "Naturel"],
    category: "Cosmétique",
  },
  {
    id: 6,
    title: "Acteur principal web-série BeninStars",
    brand: "AfroContent Studio",
    location: "Abomey-Calavi",
    budget: "300 000+ XOF",
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
    <section id="missions" className="section-padding bg-white">
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="label-tag mb-4 block">Casting ouverts</span>
            <h2 className="heading text-display-md text-forest-700">
              Missions en cours
            </h2>
            <p className="font-body text-body-lg text-[#6b7280] mt-3 max-w-xl">
              Des centaines d'opportunités professionnelles, mises à jour chaque jour.
            </p>
          </div>
          <Link
            href="/missions"
            className="btn-outline shrink-0 text-sm py-2.5"
            aria-label="Voir toutes les missions disponibles"
          >
            Toutes les missions
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* Mission Cards */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MISSIONS.map((mission) => (
            <StaggerItem key={mission.id}>
              <Link
                href={`/missions/${mission.id}`}
                className="card-premium group flex flex-col gap-4 p-6 focus-visible:outline-2 focus-visible:outline-forest-700"
                aria-label={`Mission : ${mission.title} par ${mission.brand}`}
              >
                {/* Top row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs font-heading font-600 px-2.5 py-1 rounded-full ${
                        CATEGORY_COLORS[mission.category] ?? "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {mission.category}
                    </span>
                    {mission.urgent && (
                      <span className="text-xs font-heading font-600 px-2.5 py-1 rounded-full bg-red-50 text-red-600">
                        Urgent
                      </span>
                    )}
                  </div>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="text-[#ccc] group-hover:text-forest-700 group-hover:translate-x-0.5 transition-all duration-250 shrink-0 mt-0.5"
                  />
                </div>

                {/* Title & brand */}
                <div>
                  <h3 className="font-heading font-700 text-base text-forest-700 leading-snug group-hover:text-forest-600 transition-colors duration-200">
                    {mission.title}
                  </h3>
                  <p className="font-body text-body-sm text-[#6b7280] mt-1">
                    {mission.brand}
                  </p>
                </div>

                {/* Meta */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-[#9ca3af]">
                    <MapPin size={13} aria-hidden="true" />
                    <span className="text-xs font-body">{mission.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#9ca3af]">
                    <Banknote size={13} aria-hidden="true" />
                    <span className="text-xs font-body">{mission.budget}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#9ca3af]">
                    <Clock size={13} aria-hidden="true" />
                    <span className="text-xs font-body">{mission.deadline}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#f0f1ed]">
                  {mission.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-body bg-cream-200 text-[#6b7280] px-2 py-0.5 rounded-full"
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
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-forest-50 rounded-2xl border border-forest-100">
            <p className="font-body text-body-lg text-forest-700 font-500">
              Vous êtes producteur ou marque ?
            </p>
            <Link href="/inscription/producteur" className="btn-primary shrink-0">
              Publier un casting gratuit
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
