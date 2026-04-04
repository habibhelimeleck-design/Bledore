"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Users, Briefcase, TrendingUp } from "lucide-react";

type Mode = "talent" | "recruteur";

const HERO_CONTENT = {
  talent: {
    eyebrow: "Pour les talents",
    title:   "Votre talent\nmérite d'être vu.",
    subtitle:
      "Créez votre profil, partagez vos compétences et soyez découvert par des recruteurs, marques et créateurs à travers le Gabon et l'Afrique centrale.",
    cta:     "Créer mon profil gratuit",
    ctaHref: "/inscription/talent",
    secondary:      "Voir les missions",
    secondaryHref:  "#missions",
    image: "/1.jpg",
    stat1: { value: "2 400+", label: "Talents inscrits" },
    stat2: { value: "340+",   label: "Missions réalisées" },
    stat3: { value: "4.9",    label: "Note moyenne", icon: Star },
  },
  recruteur: {
    eyebrow: "Pour les recruteurs",
    title:   "Trouvez le talent\nparfait, vite.",
    subtitle:
      "Accédez à un catalogue de talents vérifiés. Publiez vos castings, gérez les candidatures et collaborez avec les meilleurs talents du Gabon.",
    cta:     "Publier un casting",
    ctaHref: "/inscription/recruteur",
    secondary:      "Voir les talents",
    secondaryHref:  "#talents",
    image: "/2.jpg",
    stat1: { value: "120+",  label: "Recruteurs actifs" },
    stat2: { value: "85%",   label: "Casting réussi" },
    stat3: { value: "48h",   label: "Délai moyen", icon: TrendingUp },
  },
};

export default function HeroSection() {
  const [mode, setMode] = useState<Mode>("talent");
  const content = HERO_CONTENT[mode];

  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-ink pt-[72px]">
      {/* Background image — right side */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute right-0 top-0 w-[55%] h-full hidden lg:block"
          >
            <Image
              src={content.image}
              alt=""
              fill
              priority
              className="object-cover object-top"
              sizes="55vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-transparent lg:block hidden" />
        <div className="absolute inset-0 bg-ink/80 lg:hidden" />
        {/* Noise */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />
        {/* Emerald glow orbs */}
        <div
          className="absolute -top-32 -left-48 w-[600px] h-[600px] rounded-full opacity-35 pointer-events-none hidden lg:block"
          style={{ background: "radial-gradient(circle, #0d6637 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none hidden lg:block"
          style={{ background: "radial-gradient(circle, #0d6637 0%, transparent 70%)", filter: "blur(60px)" }}
        />
      </div>

      <div className="container-xl relative z-10 py-16">
        <div className="max-w-[560px]">

          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div
              role="group"
              aria-label="Choisissez votre profil"
              className="inline-flex p-1 rounded-full gap-0.5"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
            >
              {(["talent", "recruteur"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`relative px-5 py-2 rounded-full text-[0.8125rem] font-500 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-em-400 ${
                    mode === m ? "text-ink" : "text-white/45 hover:text-white/70"
                  }`}
                >
                  {mode === m && (
                    <motion.span
                      layoutId="toggle-pill"
                      className="absolute inset-0 bg-em-400 rounded-full"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative flex items-center gap-2">
                    {m === "talent" ? (
                      <Users size={14} aria-hidden="true" />
                    ) : (
                      <Briefcase size={14} aria-hidden="true" />
                    )}
                    {m === "talent" ? "Je suis un talent" : "Je suis recruteur"}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Animated content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${mode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{   opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-6"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-em-400" />
                <span className="font-mono text-[0.6875rem] font-400 tracking-[0.15em] uppercase text-em-400">
                  {content.eyebrow}
                </span>
              </div>

              {/* Title */}
              <h1
                className="font-heading font-600 text-white whitespace-pre-line leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(3.25rem,6vw,6rem)" }}
              >
                {content.title}
              </h1>

              {/* Subtitle */}
              <p className="font-body text-[1.0625rem] font-300 leading-[1.75] max-w-[460px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                {content.subtitle}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href={content.ctaHref}
                  className="inline-flex items-center gap-2 px-[1.75rem] py-[0.875rem] rounded-full font-600 text-[0.875rem] bg-em-400 text-ink hover:bg-em-300 transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(38,208,124,0.35)] group"
                >
                  {content.cta}
                  <ArrowRight size={15} aria-hidden="true" className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  href={content.secondaryHref}
                  className="inline-flex items-center gap-2 px-[1.75rem] py-[0.875rem] rounded-full font-500 text-[0.875rem] transition-all duration-300 hover:gap-3"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  {content.secondary}
                </Link>
              </div>

              {/* Stats */}
              <div
                className="flex flex-wrap gap-8 pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[content.stat1, content.stat2, content.stat3].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="font-heading font-600 text-white leading-none tracking-[-0.02em]" style={{ fontSize: "clamp(1.75rem,3vw,2rem)" }}>
                      {stat.value}
                    </span>
                    <span className="font-mono text-[0.6875rem] tracking-[0.15em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Floating badge — visible on large screens over the image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-12 right-12 hidden lg:block z-10"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "1rem 1.25rem",
          minWidth: "200px",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`badge-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "rgba(38,208,124,0.15)", border: "1px solid rgba(38,208,124,0.2)" }}
            >
              <span className="text-[0.6875rem]">⭐</span>
            </div>
            <div>
              <p className="font-heading font-600 text-sm text-white">
                {mode === "talent" ? "Mathias Asseko" : "Studio Lumière — Recruteur"}
              </p>
              <p className="font-mono text-[0.6875rem] tracking-[0.04em]" style={{ color: "rgba(255,255,255,0.45)" }}>
                {mode === "talent" ? "3 missions ce mois" : "12 talents cette semaine"}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 hidden lg:flex"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.625rem] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
          Défiler
        </span>
        <div className="w-12 h-px overflow-hidden relative" style={{ background: "rgba(255,255,255,0.2)" }}>
          <motion.div
            className="absolute top-0 left-0 h-full bg-em-400"
            style={{ width: "100%" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
