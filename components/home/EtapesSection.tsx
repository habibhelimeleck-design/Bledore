"use client";

import { motion } from "framer-motion";
import { UserPlus, Search, Handshake, Trophy } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

const ETAPES = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créez votre profil",
    description:
      "Inscrivez-vous gratuitement et créez un profil complet avec photos, vidéos et compétences. Votre vitrine professionnelle en 5 minutes.",
    accent: "#10443e",
  },
  {
    number: "02",
    icon: Search,
    title: "Explorez les missions",
    description:
      "Parcourez les castings ouverts, filtrez par catégorie, lieu et budget. Trouvez les opportunités qui correspondent à votre profil.",
    accent: "#32745c",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Postulez & collaborez",
    description:
      "Envoyez votre candidature en un clic. Échangez directement avec le recruteur via notre messagerie intégrée sécurisée.",
    accent: "#62a29a",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Réalisez & brillez",
    description:
      "Concrétisez la mission, recevez votre paiement sécurisé et construisez votre réputation grâce aux avis vérifiés.",
    accent: "#d4af87",
  },
];

export default function EtapesSection() {
  return (
    <section id="etapes" className="section-padding" style={{ background: "#f5f4f0", color: "#030f0a" }}>
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">Comment ça marche</span>
          <h2 className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-ink mb-5" style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}>
            4 étapes <em style={{ fontStyle: "italic", color: "#1a9958" }}>simples</em> pour commencer
          </h2>
          <p className="font-body font-300 text-[1rem] leading-[1.75]" style={{ color: "#3a3832" }}>
            De votre inscription à votre première mission, E.Talent simplifie chaque étape du
            processus pour vous permettre de vous concentrer sur l'essentiel : votre talent.
          </p>
        </AnimatedSection>

        {/* Steps — mobile horizontal snap scroll */}
        <div
          className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {ETAPES.map((etape, i) => {
            const Icon = etape.icon;
            return (
              <div key={i} className="snap-start shrink-0 w-[80vw]">
                <div className="p-6 h-full flex flex-col gap-5 rounded-2xl bg-white" style={{ border: "1px solid #e8e6df" }}>
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${etape.accent}15` }}>
                      <Icon size={22} strokeWidth={1.75} aria-hidden="true" style={{ color: etape.accent }} />
                    </div>
                    <span className="font-heading font-300 text-5xl leading-none select-none tracking-[-0.03em]" style={{ color: "#e8e6df" }}>
                      {etape.number}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-heading font-600 text-[1.5rem] text-ink leading-snug tracking-[-0.01em]">{etape.title}</h3>
                    <p className="font-body font-300 text-[0.9375rem] leading-[1.7]" style={{ color: "#3a3832" }}>{etape.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Steps — tablet/desktop grid */}
        <StaggerContainer className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ETAPES.map((etape, i) => {
            const Icon = etape.icon;
            return (
              <StaggerItem key={i}>
                <div className="p-7 h-full flex flex-col gap-5 group rounded-2xl bg-white transition-all duration-350 hover:-translate-y-1" style={{ border: "1px solid #e8e6df" }}>
                  {/* Number + Icon */}
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${etape.accent}15` }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        style={{ color: etape.accent }}
                      />
                    </div>
                    <span
                      className="font-heading font-300 text-5xl leading-none select-none tracking-[-0.03em] transition-colors duration-300 group-hover:text-em-500"
                      style={{ color: "#e8e6df" }}
                    >
                      {etape.number}
                    </span>
                  </div>

                  {/* Connector line (desktop) */}
                  {i < ETAPES.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden lg:block absolute top-[3.5rem] left-[calc(100%+0.5rem)] w-8 h-px bg-gradient-to-r from-[#dde0dc] to-transparent"
                    />
                  )}

                  {/* Text */}
                  <div className="flex flex-col gap-3">
                    <h3 className="font-heading font-600 text-[1.5rem] text-ink leading-snug tracking-[-0.01em]">
                      {etape.title}
                    </h3>
                    <p className="font-body font-300 text-[0.9375rem] leading-[1.7]" style={{ color: "#3a3832" }}>
                      {etape.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Progress line (desktop decoration) */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          className="hidden lg:block h-px bg-gradient-to-r from-transparent via-forest-200 to-transparent mt-2 origin-left"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
