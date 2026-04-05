"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
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

/* Fang diamond texture — émeraude on dark */
const FANG_BG = `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32,4 L60,32 L32,60 L4,32 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.5'/%3E%3Cpath d='M32,16 L48,32 L32,48 L16,32 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.3'/%3E%3Ccircle cx='32' cy='32' r='2' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.4'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   FEATURE ROW — per-row InView stagger
───────────────────────────────────────────── */
function FeatureRow({
  f,
  i,
  isLast,
}: {
  f: (typeof FEATURES)[number];
  i: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px 0px" });

  return (
    <motion.div
      ref={ref}
      className="group grid items-start gap-5"
      style={{
        gridTemplateColumns: "48px 1fr",
        paddingBottom: !isLast ? "2.5rem" : 0,
        marginBottom: !isLast ? "2.5rem" : 0,
        borderBottom: !isLast ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
      initial={{ opacity: 0, x: 24, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Icon — spring overshoot */}
      <motion.div
        className="flex items-center justify-center shrink-0"
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "rgba(38,208,124,0.08)",
          border: "1px solid rgba(38,208,124,0.12)",
          fontSize: "1.125rem",
        }}
        initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
        animate={inView ? { scale: 1, rotate: 0, opacity: 1 } : {}}
        transition={{
          duration: 0.45,
          delay: i * 0.1 + 0.1,
          ease: [0.34, 1.56, 0.64, 1],
        }}
        whileHover={{ scale: 1.12, rotate: 8 }}
      >
        {f.icon}
      </motion.div>

      {/* Text */}
      <div>
        <h3
          className="font-heading font-600 text-white mb-2 transition-colors duration-300 group-hover:text-em-400"
          style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}
        >
          {f.title}
        </h3>
        <p
          className="font-body font-300"
          style={{
            fontSize: "0.9375rem",
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.7,
          }}
        >
          {f.desc}
        </p>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function PourquoiSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const inViewHeader = useInView(headerRef, { once: true, margin: "-80px 0px" });

  /* Scroll parallax */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const img2Y = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={sectionRef}
      id="pourquoi"
      className="overflow-hidden relative"
      style={{ padding: "var(--sec-pad, 6rem) 0", background: "#071a10" }}
    >
      {/* Fang texture overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: FANG_BG,
          backgroundSize: "64px 64px",
          opacity: 0.022,
        }}
      />

      {/* Radial glow — émeraude top-right */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "-15%",
          right: "-8%",
          width: "55%",
          height: "75%",
          background:
            "radial-gradient(ellipse at center, rgba(38,208,124,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Radial glow — doré bottom-left */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: "-12%",
          left: "-6%",
          width: "40%",
          height: "60%",
          background:
            "radial-gradient(ellipse at center, rgba(212,175,135,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Visual — left ── */}
          <div className="relative">

            {/* Big image with parallax */}
            <motion.div
              className="relative overflow-hidden"
              style={{ borderRadius: 20, aspectRatio: "4/3", maxHeight: 600 }}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                style={{ y: imgY }}
                className="absolute inset-0"
                aria-hidden="true"
              >
                <Image
                  src="/2.jpg"
                  alt="Studio de casting E.Talent"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{ scale: 1.14 }}
                />
              </motion.div>
              {/* Bottom gradient fade */}
              <div
                className="absolute inset-x-0 bottom-0 h-1/4 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(7,26,16,0.55), transparent)",
                }}
              />
            </motion.div>

            {/* Small image — desktop only */}
            <motion.div
              className="absolute overflow-hidden hidden lg:block"
              style={{
                bottom: "-2rem",
                left: "-2rem",
                width: 200,
                height: 250,
                borderRadius: 14,
                border: "4px solid #071a10",
              }}
              initial={{ opacity: 0, y: 24, scale: 0.88 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <motion.div style={{ y: img2Y }} className="absolute inset-0">
                <Image
                  src="/6.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="200px"
                  style={{ scale: 1.16 }}
                />
              </motion.div>
            </motion.div>

            {/* Stars badge — desktop only */}
            <motion.div
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
              initial={{ opacity: 0, x: 20, scale: 0.88 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            >
              {/* Stars — stagger overshoot */}
              <div
                style={{
                  display: "flex",
                  gap: "0.15rem",
                  marginBottom: "0.5rem",
                }}
              >
                {Array.from({ length: 5 }).map((_, si) => (
                  <motion.span
                    key={si}
                    style={{ color: "#d4af87", fontSize: "1rem" }}
                    initial={{ opacity: 0, scale: 0.3 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.35,
                      delay: 0.55 + si * 0.07,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                  >
                    ★
                  </motion.span>
                ))}
              </div>
              <strong
                style={{
                  fontFamily:
                    "var(--f-heading, 'Cormorant Garamond', serif)",
                  fontSize: "1.375rem",
                  color: "#ffffff",
                  fontWeight: 600,
                }}
              >
                4.9 / 5
              </strong>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--f-mono, 'DM Mono', monospace)",
                  letterSpacing: "0.06em",
                  marginTop: "0.25rem",
                }}
              >
                Note moyenne globale
              </p>
            </motion.div>
          </div>

          {/* ── Features — right ── */}
          <div>
            <div ref={headerRef}>
              <motion.span
                className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase mb-6 block"
                style={{ color: "#26d07c" }}
                initial={{ opacity: 0, y: 10 }}
                animate={inViewHeader ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
              >
                Pourquoi nous
              </motion.span>

              <motion.h2
                className="font-heading font-600 text-white mb-5"
                style={{
                  fontSize: "clamp(2.5rem,4.5vw,4rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                }}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={
                  inViewHeader
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : {}
                }
                transition={{
                  duration: 0.55,
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                Fait pour
                <br />
                <em style={{ fontStyle: "italic", color: "#26d07c" }}>
                  le Gabon.
                </em>
              </motion.h2>

              <motion.p
                className="font-body font-300"
                style={{
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.45)",
                  maxWidth: 440,
                  marginBottom: "3rem",
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={inViewHeader ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                E.Talent n'est pas une plateforme importée. C'est une
                solution pensée pour les réalités gabonaises et africaines.
              </motion.p>
            </div>

            <div className="flex flex-col">
              {FEATURES.map((f, i) => (
                <FeatureRow
                  key={i}
                  f={f}
                  i={i}
                  isLast={i === FEATURES.length - 1}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}