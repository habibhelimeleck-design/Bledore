"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, Search, Handshake, Trophy } from "lucide-react";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const ETAPES = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créez votre profil",
    description:
      "Inscrivez-vous gratuitement et créez un profil complet avec photos, vidéos et compétences. Votre vitrine professionnelle en 5 minutes.",
    iconColor: "#1a9958",
    iconBg: "rgba(26,153,88,0.1)",
  },
  {
    number: "02",
    icon: Search,
    title: "Explorez les missions",
    description:
      "Parcourez les castings ouverts, filtrez par catégorie, lieu et budget. Trouvez les opportunités qui correspondent à votre profil.",
    iconColor: "#0d6637",
    iconBg: "rgba(13,102,55,0.1)",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Postulez & collaborez",
    description:
      "Envoyez votre candidature en un clic. Échangez directement avec le recruteur via notre messagerie intégrée sécurisée.",
    iconColor: "#26d07c",
    iconBg: "rgba(38,208,124,0.1)",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Réalisez & brillez",
    description:
      "Concrétisez la mission, recevez votre paiement sécurisé et construisez votre réputation grâce aux avis vérifiés.",
    iconColor: "#d4af87",
    iconBg: "rgba(212,175,135,0.12)",
  },
];

/* Punu diamond texture — ink on chalk */
const PUNU_BG_SVG = `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,3 L45,24 L24,45 L3,24 Z' fill='none' stroke='rgba(3,15,10,1)' stroke-width='0.5'/%3E%3Cpath d='M24,12 L36,24 L24,36 L12,24 Z' fill='none' stroke='rgba(3,15,10,1)' stroke-width='0.3'/%3E%3Ccircle cx='24' cy='24' r='1.4' fill='none' stroke='rgba(3,15,10,1)' stroke-width='0.4'/%3E%3C/svg%3E")`;

/* Title words for stagger */
const TITLE_PARTS = [
  { text: "4 étapes", em: false },
  { text: "simples", em: true },
  { text: "pour commencer", em: false },
];

/* ─────────────────────────────────────────────
   ETAPE CARD
───────────────────────────────────────────── */
function EtapeCard({
  etape,
  index,
  isLast,
}: {
  etape: (typeof ETAPES)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const Icon = etape.icon;

  return (
    <div ref={ref} className="relative">
      <motion.div
        initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{
          duration: 0.5,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        whileHover={{ y: -4 }}
        className="group relative p-7 h-full flex flex-col gap-5 rounded-2xl bg-white overflow-hidden"
        style={{
          border: "1px solid #e8e6df",
          boxShadow: "0 2px 8px rgba(3,15,10,0.04)",
        }}
      >
        {/* Glare shimmer — CSS transition via group-hover */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full"
            style={{
              background:
                "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) 50%, transparent 65%)",
              transition: "transform 0.7s ease",
            }}
          />
        </div>

        {/* Number + Icon row */}
        <div className="flex items-start justify-between">
          {/* Icon — spring overshoot */}
          <motion.div
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={inView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: index * 0.1 + 0.15,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: etape.iconBg }}
          >
            <Icon
              size={22}
              strokeWidth={1.75}
              aria-hidden="true"
              style={{ color: etape.iconColor }}
            />
          </motion.div>

          {/* Number — ghost → émeraude */}
          <motion.span
            initial={{ color: "#e8e6df" }}
            animate={inView ? { color: "#26d07c" } : {}}
            transition={{
              duration: 0.7,
              delay: index * 0.1 + 0.2,
              ease: "easeOut",
            }}
            className="font-heading font-300 text-5xl leading-none select-none tracking-[-0.03em]"
          >
            {etape.number}
          </motion.span>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-3">
          <h3 className="font-heading font-600 text-[1.5rem] text-ink leading-snug tracking-[-0.01em]">
            {etape.title}
          </h3>
          <p
            className="font-body font-300 text-[0.9375rem] leading-[1.7]"
            style={{ color: "#3a3832" }}
          >
            {etape.description}
          </p>
        </div>

        {/* Step bar — scaleX fill on reveal */}
        <div className="mt-auto pt-4" style={{ borderTop: "1px solid #e8e6df" }}>
          <div
            className="h-px w-full rounded-full overflow-hidden"
            style={{ background: "#e8e6df" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${etape.iconColor}, #26d07c)`,
              }}
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{
                duration: 0.8,
                delay: index * 0.1 + 0.35,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Desktop connector arrow */}
      {!isLast && (
        <motion.div
          className="hidden lg:flex absolute top-[3.25rem] -right-5 z-10 items-center"
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.5 }}
          aria-hidden="true"
        >
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: "#26d07c" }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.6,
            }}
          />
          <div
            className="w-5 h-px mx-0.5"
            style={{ background: "rgba(38,208,124,0.3)" }}
          />
          <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
            <path
              d="M1 1l4 4-4 4"
              stroke="#26d07c"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function EtapesSection() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inViewHeader = useInView(headerRef, { once: true, margin: "-80px 0px" });

  return (
    <section
      id="etapes"
      className="section-padding overflow-hidden relative"
      style={{ background: "#f5f4f0", color: "#030f0a" }}
    >
      {/* Punu texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: PUNU_BG_SVG,
          backgroundSize: "48px 48px",
          opacity: 0.016,
        }}
      />

      {/* Radial glow — émeraude center-top (très subtil sur chalk) */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "60%",
          height: "50%",
          background:
            "radial-gradient(ellipse at center, rgba(38,208,124,0.06) 0%, transparent 65%)",
        }}
      />

      <div className="container-xl relative z-10">

        {/* ── Header ── */}
        <div ref={headerRef} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">

          {/* Fang diamond — decorative motif */}
          <motion.div
            className="mx-auto mb-6 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.4, rotate: 45 }}
            animate={inViewHeader ? { opacity: 1, scale: 1, rotate: 45 } : {}}
            transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
            aria-hidden="true"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path
                d="M14,1 L27,14 L14,27 L1,14 Z"
                stroke="#1a9958"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M14,7 L21,14 L14,21 L7,14 Z"
                stroke="#1a9958"
                strokeWidth="0.6"
                fill="none"
              />
              <circle cx="14" cy="14" r="1.8" fill="#26d07c" />
            </svg>
          </motion.div>

          <motion.span
            className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-600 mb-6 block"
            initial={{ opacity: 0, y: 10 }}
            animate={inViewHeader ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            Comment ça marche
          </motion.span>

          {/* Title — phrase stagger */}
          <h2
            className="font-heading font-600 leading-[1.05] tracking-[-0.02em] text-ink mb-5"
            style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}
          >
            {TITLE_PARTS.map((part, pi) =>
              part.em ? (
                <motion.em
                  key={pi}
                  style={{
                    fontStyle: "italic",
                    color: "#1a9958",
                    display: "inline-block",
                    marginLeft: "0.22em",
                    marginRight: "0.22em",
                  }}
                  initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
                  animate={
                    inViewHeader
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.15 + pi * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {part.text}
                </motion.em>
              ) : (
                <motion.span
                  key={pi}
                  style={{ display: "inline-block" }}
                  initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
                  animate={
                    inViewHeader
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + pi * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {part.text}
                </motion.span>
              )
            )}
          </h2>

          <motion.p
            className="font-body font-300 text-[1rem] leading-[1.75]"
            style={{ color: "#3a3832" }}
            initial={{ opacity: 0, y: 14 }}
            animate={inViewHeader ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.38 }}
          >
            De votre inscription à votre première mission, E.Talent simplifie
            chaque étape du processus pour vous permettre de vous concentrer
            sur l'essentiel : votre talent.
          </motion.p>
        </div>

        {/* ── Mobile — snap scroll ── */}
        <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 hide-scrollbar">
          {ETAPES.map((etape, i) => {
            const Icon = etape.icon;
            return (
              <div key={i} className="snap-start shrink-0 w-[80vw]">
                <div
                  className="p-6 h-full flex flex-col gap-5 rounded-2xl bg-white"
                  style={{ border: "1px solid #e8e6df" }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: etape.iconBg }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.75}
                        aria-hidden="true"
                        style={{ color: etape.iconColor }}
                      />
                    </div>
                    <span
                      className="font-heading font-300 text-5xl leading-none select-none tracking-[-0.03em]"
                      style={{ color: "#26d07c" }}
                    >
                      {etape.number}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-heading font-600 text-[1.5rem] text-ink leading-snug tracking-[-0.01em]">
                      {etape.title}
                    </h3>
                    <p
                      className="font-body font-300 text-[0.9375rem] leading-[1.7]"
                      style={{ color: "#3a3832" }}
                    >
                      {etape.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Desktop — grid ── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {ETAPES.map((etape, i) => (
            <EtapeCard
              key={i}
              etape={etape}
              index={i}
              isLast={i === ETAPES.length - 1}
            />
          ))}
        </div>

        {/* ── Progress track — émeraude draw-on ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{
            duration: 1.4,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.5,
          }}
          className="hidden lg:block h-px mt-3 origin-left"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, #26d07c 30%, #1a9958 70%, transparent 100%)",
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}