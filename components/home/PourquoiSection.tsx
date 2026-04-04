import Image from "next/image";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const FEATURES = [
  {
    icon: "🛡️",
    title: "Profils 100% vérifiés",
    desc: "Chaque talent et recruteur est validé par notre équipe locale. Identité, compétences, réputation — zéro fraude.",
  },
  {
    icon: "⚡",
    title: "Matching instantané",
    desc: "Notre algorithme connecte les bons talents aux bons recruteurs en quelques secondes. Pertinence maximale.",
  },
  {
    icon: "🔐",
    title: "Paiement sécurisé XAF",
    desc: "Escrow local en XAF. L'argent est bloqué à la mission et libéré à la validation. Votre travail est protégé.",
  },
  {
    icon: "🌍",
    title: "Réseau Afrique Centrale",
    desc: "Gabon, Cameroun, Congo, Centrafrique — E.Talent s'étend sur toute la région. Votre talent, sans frontière.",
  },
];

export default function PourquoiSection() {
  return (
    <section id="pourquoi" className="overflow-hidden" style={{ padding: "var(--sec-pad, 6rem) 0", background: "#071a10" }}>
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Visual — left */}
          <AnimatedSection className="relative">
            {/* Big image — aspect ratio adapté au mobile */}
            <div
              className="relative overflow-hidden"
              style={{ borderRadius: 20, aspectRatio: "4/3", maxHeight: 600 }}
            >
              <div className="hidden lg:block absolute inset-0" style={{ aspectRatio: "3/4" }} />
              <Image
                src="/2.jpg"
                alt="Studio de casting E.Talent"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Small image — desktop seulement (évite débordement mobile) */}
            <div
              className="absolute overflow-hidden hidden lg:block"
              style={{
                bottom: "-2rem",
                left: "-2rem",
                width: 200,
                height: 250,
                borderRadius: 14,
                border: "4px solid #071a10",
              }}
            >
              <Image
                src="/6.jpg"
                alt=""
                fill
                className="object-cover"
                sizes="200px"
              />
            </div>

            {/* Badge — desktop seulement (évite débordement mobile) */}
            <div
              className="absolute hidden lg:block"
              style={{
                top: "2rem",
                right: "-1.5rem",
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 14,
                padding: "1.25rem",
                minWidth: 180,
              }}
            >
              <div style={{ color: "#d4af87", fontSize: "1rem", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>
                ★★★★★
              </div>
              <strong style={{ fontFamily: "var(--f-heading, 'Cormorant Garamond', serif)", fontSize: "1.375rem", color: "#ffffff", fontWeight: 600 }}>
                4.9 / 5
              </strong>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", fontFamily: "var(--f-mono, 'DM Mono', monospace)", letterSpacing: "0.06em", marginTop: "0.25rem" }}>
                Note moyenne globale
              </p>
            </div>
          </AnimatedSection>

          {/* Features — right */}
          <div>
            <AnimatedSection>
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase mb-6 block" style={{ color: "#26d07c" }}>
                Pourquoi nous
              </span>
              <h2
                className="font-heading font-600 text-white mb-5"
                style={{ fontSize: "clamp(2.5rem,4.5vw,4rem)", lineHeight: 1.0, letterSpacing: "-0.02em" }}
              >
                Fait pour<br />
                <em style={{ fontStyle: "italic", color: "#26d07c" }}>le Gabon.</em>
              </h2>
              <p className="font-body font-300" style={{ fontSize: "1rem", lineHeight: 1.75, color: "rgba(255,255,255,0.45)", maxWidth: 440, marginBottom: "3rem" }}>
                E.Talent n'est pas une plateforme importée. C'est une solution pensée pour les réalités gabonaises et africaines.
              </p>
            </AnimatedSection>

            <StaggerContainer className="flex flex-col">
              {FEATURES.map((f, i) => (
                <StaggerItem key={i}>
                  <div
                    className="group grid items-start gap-5"
                    style={{
                      gridTemplateColumns: "48px 1fr",
                      paddingBottom: i < FEATURES.length - 1 ? "2.5rem" : 0,
                      marginBottom: i < FEATURES.length - 1 ? "2.5rem" : 0,
                      borderBottom: i < FEATURES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: "rgba(38,208,124,0.08)",
                        border: "1px solid rgba(38,208,124,0.12)",
                        fontSize: "1.125rem",
                      }}
                    >
                      {f.icon}
                    </div>

                    {/* Text */}
                    <div>
                      <h3 className="font-heading font-600 text-white mb-2" style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}>
                        {f.title}
                      </h3>
                      <p className="font-body font-300" style={{ fontSize: "0.9375rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

        </div>
      </div>
    </section>
  );
}