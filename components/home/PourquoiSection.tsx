"use client";

import { Shield, Zap, Globe, Award, HeartHandshake, BarChart3 } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const RAISONS = [
  {
    icon: Shield,
    title: "Profils vérifiés",
    description:
      "Chaque talent et chaque producteur est vérifié par notre équipe. Zéro fraude, que de la confiance.",
    color: "#10443e",
    bg:    "#f0f7f6",
  },
  {
    icon: Zap,
    title: "Matching intelligent",
    description:
      "Notre algorithme analyse vos critères et vous propose les profils les plus pertinents en quelques secondes.",
    color: "#32745c",
    bg:    "#f0f9f7",
  },
  {
    icon: Globe,
    title: "Réseau africain",
    description:
      "Bénin, Togo, Côte d'Ivoire, Sénégal… WeAct s'étend à travers toute l'Afrique de l'Ouest.",
    color: "#d4af87",
    bg:    "#fdf7f0",
  },
  {
    icon: Award,
    title: "Paiement sécurisé",
    description:
      "Les paiements sont sécurisés et libérés uniquement à la fin de la mission. Votre argent est protégé.",
    color: "#62a29a",
    bg:    "#f0f7f6",
  },
  {
    icon: HeartHandshake,
    title: "Support dédié",
    description:
      "Notre équipe béninoise est disponible 7j/7 pour vous accompagner à chaque étape de vos projets.",
    color: "#10443e",
    bg:    "#f0f7f6",
  },
  {
    icon: BarChart3,
    title: "Statistiques & insights",
    description:
      "Suivez vos performances, vos candidatures et l'impact de vos castings avec un tableau de bord clair.",
    color: "#32745c",
    bg:    "#f0f9f7",
  },
];

const STATS = [
  { value: "2 400+", label: "Talents inscrits",    sublabel: "et en croissance" },
  { value: "340+",   label: "Missions réalisées",  sublabel: "cette année" },
  { value: "120+",   label: "Producteurs actifs",  sublabel: "au Bénin & Afrique" },
  { value: "98%",    label: "Satisfaction client", sublabel: "selon nos enquêtes" },
];

export default function PourquoiSection() {
  return (
    <section id="pourquoi" className="section-padding bg-forest-gradient">
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="label-gold mb-4 block">Pourquoi WeAct</span>
          <h2 className="heading text-display-md text-white mb-5">
            La plateforme conçue pour l'Afrique
          </h2>
          <p className="font-body text-body-lg text-forest-200 leading-relaxed">
            WeAct n'est pas un copier-coller d'une plateforme occidentale. C'est une solution
            pensée pour les réalités, les besoins et les ambitions des talents africains.
          </p>
        </AnimatedSection>

        {/* Cards Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {RAISONS.map((raison, i) => {
            const Icon = raison.icon;
            return (
              <StaggerItem key={i}>
                <div className="group flex flex-col gap-4 p-7 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 hover:bg-white/14 hover:border-white/20 transition-all duration-350 cursor-default">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: raison.bg }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      style={{ color: raison.color }}
                    />
                  </div>
                  <div>
                    <h3 className="font-heading font-700 text-base text-white mb-2">
                      {raison.title}
                    </h3>
                    <p className="font-body text-body-sm text-forest-200 leading-relaxed">
                      {raison.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Stats Bar */}
        <AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
            {STATS.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-1.5 py-10 px-6 text-center bg-white/5 hover:bg-white/10 transition-colors duration-250"
              >
                <span className="font-heading font-800 text-[clamp(2rem,4vw,3rem)] text-white leading-none">
                  {stat.value}
                </span>
                <span className="font-heading font-600 text-sm text-forest-200">
                  {stat.label}
                </span>
                <span className="font-body text-xs text-forest-300/70">
                  {stat.sublabel}
                </span>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
