"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, ArrowRight, Verified } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

type Category = "Tous" | "Acteurs" | "Mannequins" | "Voix" | "Danseurs";

const CATEGORIES: Category[] = ["Tous", "Acteurs", "Mannequins", "Voix", "Danseurs"];

const TALENTS = [
  {
    id: 1,
    name: "Laeticia Mboumba",
    role: "Actrice & Présentatrice",
    city: "Libreville",
    rating: 4.9,
    missions: 18,
    verified: true,
    categories: ["Acteurs"],
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    specialty: "Publicité, Cinéma",
  },
  {
    id: 2,
    name: "Jean-Pierre Ndong",
    role: "Mannequin & Influenceur",
    city: "Port-Gentil",
    rating: 4.8,
    missions: 24,
    verified: true,
    categories: ["Mannequins"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialty: "Mode, Lifestyle",
  },
  {
    id: 3,
    name: "Christelle Ondo",
    role: "Comédienne",
    city: "Libreville",
    rating: 4.7,
    missions: 12,
    verified: true,
    categories: ["Acteurs"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    specialty: "Théâtre, Web-séries",
  },
  {
    id: 4,
    name: "Sylvie Nzamba",
    role: "Artiste vocale",
    city: "Franceville",
    rating: 5.0,
    missions: 9,
    verified: true,
    categories: ["Voix"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    specialty: "Jingles, Doublage",
  },
  {
    id: 5,
    name: "Rodrigue Obiang",
    role: "Mannequin Editorial",
    city: "Libreville",
    rating: 4.9,
    missions: 31,
    verified: true,
    categories: ["Mannequins"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    specialty: "Editorial, Runway",
  },
  {
    id: 6,
    name: "Patience Moussavou",
    role: "Danseuse Afrobeat",
    city: "Libreville",
    rating: 4.8,
    missions: 15,
    verified: false,
    categories: ["Danseurs"],
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    specialty: "Vidéoclips, Événements",
  },
];

function TalentCard({ talent, index }: { talent: (typeof TALENTS)[0]; index: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <Link
        href={`/talents/${talent.id}`}
        className="group relative flex flex-col overflow-hidden rounded-2xl focus-visible:outline-2 focus-visible:outline-em-400"
        aria-label={`Voir le profil de ${talent.name}, ${talent.role}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={talent.image}
            alt={`Portrait de ${talent.name}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Permanent overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(3,15,10,0.95) 0%, rgba(3,15,10,0.3) 45%, transparent 70%)" }} />

          {/* Verified badge */}
          {talent.verified && (
            <div
              className="absolute top-3 left-3 flex items-center gap-1 backdrop-blur-sm rounded-full px-2.5 py-1"
              style={{ background: "rgba(38,208,124,0.15)", border: "1px solid rgba(38,208,124,0.2)" }}
              aria-label="Talent vérifié"
            >
              <Verified size={10} fill="#7de8b4" stroke="none" aria-hidden="true" />
              <span className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase text-em-300">
                Vérifié
              </span>
            </div>
          )}

          {/* Arrow CTA — appears on hover */}
          <div
            className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-350 scale-0 group-hover:scale-100 rotate-[-45deg] group-hover:rotate-0"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
          >
            <ArrowRight size={14} className="text-white" aria-hidden="true" />
          </div>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-heading font-600 text-[1.25rem] text-white leading-[1.2] tracking-[-0.01em] mb-1">
              {talent.name}
            </h3>
            <p className="font-body text-[0.8125rem] font-300" style={{ color: "rgba(255,255,255,0.55)" }}>{talent.role}</p>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-2">
              <Star size={12} fill="#d4a843" stroke="none" aria-hidden="true" />
              <span className="font-mono text-[0.75rem] text-gold-DEFAULT">{talent.rating}</span>
              <span className="font-body text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>· {talent.city}</span>
            </div>

            {/* Tags — appear on hover */}
            <div className="flex flex-wrap gap-1.5 mt-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400">
              {talent.specialty.split(", ").map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(38,208,124,0.15)", color: "#7de8b4", border: "1px solid rgba(38,208,124,0.2)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function TalentsSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("Tous");

  const filtered =
    activeCategory === "Tous"
      ? TALENTS
      : TALENTS.filter((t) => t.categories.includes(activeCategory));

  return (
    <section id="talents" className="section-padding bg-ink overflow-hidden">
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">Catalogue talents</span>
            <h2 className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-white" style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}>
              Découvrez nos <em className="italic text-em-500 not-italic" style={{ fontStyle: "italic" }}>talents</em>
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

        {/* Category Filter */}
        <AnimatedSection delay={0.1} className="mb-10">
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
                className={`px-4 py-2 rounded-full text-sm font-500 transition-all duration-250 cursor-pointer focus-visible:outline-2 focus-visible:outline-em-400 ${
                  activeCategory === cat
                    ? "bg-em-400 text-ink"
                    : "text-white/50 border border-white/15 hover:border-white/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Grid */}
        <motion.div
          layout
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
