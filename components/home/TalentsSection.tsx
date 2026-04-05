"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  LayoutGroup,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Verified } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { STATIC_TALENTS, StaticTalent } from "@/lib/data/talents";

/* ─────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────── */
type Category =
  | "Tous"
  | "Photographie"
  | "Création de contenu"
  | "Acteurs"
  | "Mannequins"
  | "Voix";

const CATEGORIES: Category[] = [
  "Tous",
  "Photographie",
  "Création de contenu",
  "Acteurs",
  "Mannequins",
  "Voix",
];

/* Fang-inspired diamond SVG as data-URI background texture */
const FANG_BG_SVG = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,2 L38,20 L20,38 L2,20 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.6'/%3E%3Cpath d='M20,9 L31,20 L20,31 L9,20 Z' fill='none' stroke='rgba(212,168,67,1)' stroke-width='0.3'/%3E%3Ccircle cx='20' cy='20' r='1.2' fill='rgba(38,208,124,1)'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   TALENT CARD — 3D tilt + glare shimmer
───────────────────────────────────────────── */
function TalentCard({
  talent,
  index,
}: {
  talent: StaticTalent;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  /* 3D tilt per-card */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 180,
    damping: 22,
  });
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [8, -8]), {
    stiffness: 180,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
    rawY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ perspective: "1000px" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
        <Link
          href={`/talents/${talent.id}`}
          className="group relative flex flex-col overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-em-400"
          aria-label={`Voir le profil de ${talent.name}, ${talent.role}`}
        >
          {/* ── Image ── */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={talent.image}
              alt={`Portrait de ${talent.name}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.08]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(3,15,10,0.96) 0%, rgba(3,15,10,0.4) 48%, transparent 72%)",
              }}
            />

            {/* Glare shimmer — CSS transition for cross-browser reliability */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.07) 50%, transparent 72%)",
                transform: hovered ? "translateX(120%)" : "translateX(-120%)",
                transition: hovered
                  ? "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)"
                  : "none",
              }}
            />

            {/* ── Verified badge with pulsing dot ── */}
            {talent.verified && (
              <div
                className="absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-sm rounded-full px-2.5 py-1"
                style={{
                  background: "rgba(38,208,124,0.12)",
                  border: "1px solid rgba(38,208,124,0.22)",
                }}
                aria-label="Talent vérifié"
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#26d07c" }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.45, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase text-em-300">
                  Vérifié
                </span>
              </div>
            )}

            {/* ── Missions count badge (top-right, hides on hover) ── */}
            <div
              className="absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 transition-all duration-200 group-hover:opacity-0 group-hover:scale-75"
              style={{
                background: "rgba(3,15,10,0.72)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <span
                className="font-mono text-[0.5625rem] tracking-[0.08em] uppercase"
                style={{ color: "rgba(255,255,255,0.48)" }}
              >
                {talent.missions} missions
              </span>
            </div>

            {/* ── Arrow CTA (top-right, appears on hover) ── */}
            <div
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100 -rotate-45 group-hover:rotate-0"
              style={{
                background: "rgba(38,208,124,0.18)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(38,208,124,0.28)",
              }}
            >
              <ArrowRight size={14} className="text-em-400" aria-hidden="true" />
            </div>

            {/* ── Info overlay ── */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-heading font-600 text-[1.25rem] text-white leading-[1.2] tracking-[-0.01em] mb-0.5">
                {talent.name}
              </h3>
              <p
                className="font-body text-[0.8125rem] font-300"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {talent.role}
              </p>

              {/* Rating + city */}
              <div className="flex items-center gap-1.5 mt-2">
                <Star size={11} fill="#d4a843" stroke="none" aria-hidden="true" />
                <span className="font-mono text-[0.75rem]" style={{ color: "#d4a843" }}>
                  {talent.rating}
                </span>
                <span
                  className="font-body text-xs"
                  style={{ color: "rgba(255,255,255,0.32)" }}
                >
                  · {talent.city}
                </span>
              </div>

              {/* Specialty — always visible, subtle */}
              <p
                className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase mt-2 transition-opacity duration-300 group-hover:opacity-0"
                style={{ color: "rgba(38,208,124,0.45)" }}
              >
                {talent.specialty}
              </p>

              {/* Tag pills — revealed on hover */}
              <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-350">
                {talent.specialty.split(", ").map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(38,208,124,0.15)",
                      color: "#7de8b4",
                      border: "1px solid rgba(38,208,124,0.2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function TalentsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Mobile rAF auto-scroll — iOS-safe, DO NOT MODIFY */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let paused = false;
    let raf: number;
    const tick = () => {
      if (!paused) {
        el.scrollLeft += 0.8;
        if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", resume, { passive: true });
    el.addEventListener("touchcancel", resume, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", resume);
      el.removeEventListener("touchcancel", resume);
    };
  }, []);

  const filtered =
    activeCategory === "Tous"
      ? STATIC_TALENTS
      : STATIC_TALENTS.filter((t) => t.categories.includes(activeCategory));

  return (
    <section
      id="talents"
      className="section-padding overflow-hidden relative"
      style={{ background: "#030f0a" }}
    >
      {/* Fang texture background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: FANG_BG_SVG,
          backgroundSize: "40px 40px",
          opacity: 0.025,
        }}
      />

      <div className="container-xl relative z-10">

        {/* ── Section header ── */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-6">
          <div>
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">
              Catalogue talents
            </span>
            <h2
              className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}
            >
              Découvrez nos{" "}
              <em className="italic text-em-500" style={{ fontStyle: "italic" }}>
                talents
              </em>
            </h2>
          </div>
          <Link
            href="/talents"
            className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-em-400 hover:gap-3 transition-all duration-250 shrink-0"
            aria-label="Voir tous les talents E.Talent"
          >
            Voir tous les talents
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* ── Ecosystem marquee strip ── */}
        <div
          aria-hidden="true"
          className="mb-10 overflow-hidden border-b"
          style={{ borderColor: "rgba(255,255,255,0.05)", paddingBottom: "1.5rem" }}
        >
          <div className="marquee-track">
            {[0, 1].map((i) => (
              <span
                key={i}
                className="font-mono text-[0.625rem] tracking-[0.2em] uppercase"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {[
                  "Digital",
                  "Mode",
                  "Cinéma",
                  "Editorial",
                  "Runway",
                  "Voix",
                  "Photographie",
                  "Beauté",
                  "Sport",
                  "Musique",
                ].map((word, wi) => (
                  <React.Fragment key={wi}>
                    {word}
                    <span style={{ color: "#26d07c", margin: "0 0.75em" }}>·</span>
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── Category filter — desktop with spring indicator ── */}
        <AnimatedSection delay={0.1} className="mb-10 hidden sm:block">
          <LayoutGroup id="talents-filter">
            <div
              role="group"
              aria-label="Filtrer par catégorie"
              className="flex flex-wrap gap-2"
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`relative px-4 py-2 rounded-full text-sm font-500 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-em-400 ${
                    activeCategory === cat
                      ? "text-ink"
                      : "text-white/50 border border-white/15 hover:border-white/40 hover:text-white"
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.span
                      layoutId="cat-pill"
                      className="absolute inset-0 rounded-full bg-em-400"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{cat}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        </AnimatedSection>

        {/* ── Mobile carousel (rAF — iOS-safe, DO NOT TOUCH) ── */}
        <div
          ref={scrollRef}
          className="sm:hidden -mx-5"
          style={{
            overflowX: "auto",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          <div className="flex gap-4 px-5" style={{ width: "max-content" }}>
            {[...STATIC_TALENTS, ...STATIC_TALENTS].map((talent, i) => (
              <Link
                key={i}
                href={`/talents/${talent.id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl shrink-0"
                style={{ width: "72vw" }}
                aria-label={`Voir le profil de ${talent.name}, ${talent.role}`}
              >
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={talent.image}
                    alt={`Portrait de ${talent.name}`}
                    fill
                    priority={i < 6}
                    className="object-cover"
                    sizes="72vw"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(3,15,10,0.95) 0%, rgba(3,15,10,0.3) 45%, transparent 70%)",
                    }}
                  />
                  {talent.verified && (
                    <div
                      className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full px-2.5 py-1"
                      style={{
                        background: "rgba(10,40,22,0.85)",
                        border: "1px solid rgba(38,208,124,0.25)",
                      }}
                    >
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "#26d07c" }}
                        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.45, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <span className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase text-em-300">
                        Vérifié
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading font-600 text-[1.125rem] text-white leading-[1.2] tracking-[-0.01em] mb-0.5">
                      {talent.name}
                    </h3>
                    <p
                      className="font-body text-[0.8125rem] font-300"
                      style={{ color: "rgba(255,255,255,0.55)" }}
                    >
                      {talent.role}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Star size={11} fill="#d4a843" stroke="none" aria-hidden="true" />
                      <span className="font-mono text-[0.75rem]" style={{ color: "#d4a843" }}>
                        {talent.rating}
                      </span>
                      <span
                        className="font-body text-xs"
                        style={{ color: "rgba(255,255,255,0.35)" }}
                      >
                        · {talent.city}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Desktop filterable grid ── */}
        <motion.div
          layout
          className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((talent, i) => (
              <TalentCard key={talent.id} talent={talent} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 font-body"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Aucun talent dans cette catégorie pour le moment.
          </motion.div>
        )}
      </div>
    </section>
  );
}