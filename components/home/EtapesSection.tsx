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
    <section id="etapes" className="section-padding bg-white">
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <span className="label-tag mb-4 block">Comment ça marche</span>
          <h2 className="heading text-display-md text-forest-700 mb-5">
            4 étapes simples pour commencer
          </h2>
          <p className="font-body text-body-lg text-[#6b7280]">
            De votre inscription à votre première mission, E.Talent simplifie chaque étape du
            processus pour vous permettre de vous concentrer sur l'essentiel : votre talent.
          </p>
        </AnimatedSection>

        {/* Steps Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ETAPES.map((etape, i) => {
            const Icon = etape.icon;
            return (
              <StaggerItem key={i}>
                <div className="card-premium p-7 h-full flex flex-col gap-5 group">
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
                      className="font-heading font-800 text-4xl leading-none select-none transition-colors duration-300"
                      style={{ color: `${etape.accent}20` }}
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
                    <h3 className="heading font-heading font-700 text-lg text-forest-700 leading-snug">
                      {etape.title}
                    </h3>
                    <p className="font-body text-body-sm text-[#6b7280] leading-relaxed">
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
