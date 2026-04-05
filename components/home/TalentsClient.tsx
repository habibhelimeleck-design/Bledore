"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

/* ─────────────────────────────────────────────
   TYPE
───────────────────────────────────────────── */
export type TalentCardData = {
  id: string;
  name: string;
  role: string;
  city: string;
  rating: number | null;
  missions: number | null;
  verified: boolean;
  categories: string[];
  image: string | null;
  specialty: string;
};

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

const FANG_BG_SVG = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,2 L38,20 L20,38 L2,20 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.6'/%3E%3Cpath d='M20,9 L31,20 L20,31 L9,20 Z' fill='none' stroke='rgba(212,168,67,1)' stroke-width='0.3'/%3E%3Ccircle cx='20' cy='20' r='1.2' fill='rgba(38,208,124,1)'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   CAROUSEL CARD — compact + hover effects
───────────────────────────────────────────── */
function CarouselCard({ talent }: { talent: TalentCardData }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href={`/talents/${talent.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl shrink-0 focus-visible:outline-2 focus-visible:outline-em-400"
      style={{ width: 280 }}
      aria-label={`Voir le profil de ${talent.name}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        {/* Image ou placeholder */}
        {talent.image ? (
          <Image
            src={talent.image}
            alt={`Portrait de ${talent.name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.07]"
            sizes="280px"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #071a10 0%, #0d2d1a 100%)" }}
          >
            <span
              style={{
                fontFamily: "var(--f-heading,'Cormorant Garamond',serif)",
                fontSize: "4rem",
                fontWeight: 600,
                color: "rgba(38,208,124,0.18)",
              }}
            >
              {talent.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,15,10,0.97) 0%, rgba(3,15,10,0.35) 50%, transparent 75%)",
          }}
        />

        {/* Glare shimmer */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(105deg, transparent 28%, rgba(255,255,255,0.06) 50%, transparent 72%)",
            transform: hovered ? "translateX(120%)" : "translateX(-120%)",
            transition: hovered
              ? "transform 0.55s cubic-bezier(0.25,0.46,0.45,0.94)"
              : "none",
          }}
        />

        {/* Verified badge */}
        {talent.verified && (
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 backdrop-blur-sm rounded-full px-2.5 py-1"
            style={{
              background: "rgba(38,208,124,0.12)",
              border: "1px solid rgba(38,208,124,0.22)",
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

        {/* Arrow CTA */}
        <div
          className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100"
          style={{
            background: "rgba(38,208,124,0.18)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(38,208,124,0.28)",
          }}
        >
          <ArrowRight size={14} className="text-em-400" aria-hidden="true" />
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3
            className="font-heading font-600 text-white leading-[1.15] tracking-[-0.01em] mb-0.5"
            style={{ fontSize: "1.125rem" }}
          >
            {talent.name}
          </h3>
          <p
            className="font-body text-[0.8125rem] font-300"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {talent.role}
          </p>

          <div className="flex items-center gap-1.5 mt-1.5">
            {talent.rating !== null && (
              <>
                <Star size={10} fill="#d4a843" stroke="none" aria-hidden="true" />
                <span className="font-mono text-[0.6875rem]" style={{ color: "#d4a843" }}>
                  {talent.rating}
                </span>
                <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
              </>
            )}
            <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              {talent.city}
            </span>
          </div>

          {/* Tag pills on hover */}
          {talent.specialty && (
            <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              {talent.specialty.split(", ").slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.5rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
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
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   INFINITE CAROUSEL — rAF scroll, pause on hover
───────────────────────────────────────────── */
function InfiniteCarousel({ items }: { items: TalentCardData[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const rafRef = useRef<number>(0);

  /* Double items pour boucle infinie */
  const doubled = [...items, ...items];

  const startRaf = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const tick = () => {
      if (!pausedRef.current) {
        el.scrollLeft += 0.6;
        /* Reset à mi-chemin pour boucle seamless */
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    startRaf();
    return () => cancelAnimationFrame(rafRef.current);
  }, [startRaf, items]);

  /* Reset scroll quand items changent (filtre) */
  useEffect(() => {
    if (trackRef.current) trackRef.current.scrollLeft = 0;
  }, [items]);

  const pause  = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <div
      ref={trackRef}
      className="-mx-5 sm:-mx-8 lg:-mx-16"
      style={{
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        cursor: "grab",
      }}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      onTouchCancel={resume}
    >
      <div
        className="flex gap-4 px-5 sm:px-8 lg:px-16"
        style={{ width: "max-content", paddingBottom: "0.5rem" }}
      >
        {doubled.map((talent, i) => (
          <CarouselCard key={`${talent.id}-${i}`} talent={talent} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────────── */
function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 gap-4"
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center"
        style={{ background: "rgba(38,208,124,0.06)", border: "1px solid rgba(38,208,124,0.12)" }}
      >
        <span style={{ fontFamily: "var(--f-heading,'Cormorant Garamond',serif)", fontSize: "1.5rem", color: "rgba(38,208,124,0.3)" }}>
          E
        </span>
      </div>
      <p className="font-body text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
        Aucun talent dans cette catégorie pour le moment.
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function TalentsClient({ talents }: { talents: TalentCardData[] }) {
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");

  const filtered =
    activeCategory === "Tous"
      ? talents
      : talents.filter((t) => t.categories.includes(activeCategory));

  return (
    <section
      id="talents"
      className="section-padding overflow-hidden relative"
      style={{ background: "#030f0a" }}
    >
      {/* Fang texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: FANG_BG_SVG, backgroundSize: "40px 40px", opacity: 0.025 }}
      />

      <div className="container-xl relative z-10">

        {/* ── Header ── */}
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
          >
            Voir tous les talents
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* ── Ecosystem marquee ── */}
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
                {["Digital","Mode","Cinéma","Editorial","Runway","Voix","Photographie","Beauté","Sport","Musique"].map((word, wi) => (
                  <React.Fragment key={wi}>
                    {word}
                    <span style={{ color: "#26d07c", margin: "0 0.75em" }}>·</span>
                  </React.Fragment>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ── Filtres catégories ── */}
        <AnimatedSection delay={0.1} className="mb-8">
          <LayoutGroup id="talents-filter">
            <div role="group" aria-label="Filtrer par catégorie" className="flex flex-wrap gap-2">
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

        {/* ── Carousel infini ── */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <EmptyState key="empty" />
          ) : (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <InfiniteCarousel items={filtered} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fade edges */}
        <div className="pointer-events-none relative -mt-px">
          <div
            className="absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to right, #030f0a, transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: "linear-gradient(to left, #030f0a, transparent)" }}
          />
        </div>

      </div>
    </section>
  );
}