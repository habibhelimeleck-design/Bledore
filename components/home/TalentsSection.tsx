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
    name: "Amina Kossou",
    role: "Actrice & Présentatrice",
    city: "Cotonou",
    rating: 4.9,
    missions: 18,
    verified: true,
    categories: ["Acteurs"],
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    specialty: "Publicité, Cinéma",
  },
  {
    id: 2,
    name: "Kofi Adjovi",
    role: "Mannequin & Influenceur",
    city: "Porto-Novo",
    rating: 4.8,
    missions: 24,
    verified: true,
    categories: ["Mannequins"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    specialty: "Mode, Lifestyle",
  },
  {
    id: 3,
    name: "Fatoumata Diallo",
    role: "Comédienne",
    city: "Cotonou",
    rating: 4.7,
    missions: 12,
    verified: true,
    categories: ["Acteurs"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    specialty: "Théâtre, Web-séries",
  },
  {
    id: 4,
    name: "Sèlomè Houngbé",
    role: "Artiste vocale",
    city: "Abomey-Calavi",
    rating: 5.0,
    missions: 9,
    verified: true,
    categories: ["Voix"],
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    specialty: "Jingles, Doublage",
  },
  {
    id: 5,
    name: "Edouard Ahounou",
    role: "Mannequin Editorial",
    city: "Cotonou",
    rating: 4.9,
    missions: 31,
    verified: true,
    categories: ["Mannequins"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    specialty: "Editorial, Runway",
  },
  {
    id: 6,
    name: "Ines Tossou",
    role: "Danseuse Afrobeat",
    city: "Cotonou",
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
        className="card-premium group flex flex-col overflow-hidden focus-visible:outline-2 focus-visible:outline-forest-700"
        aria-label={`Voir le profil de ${talent.name}, ${talent.role}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={talent.image}
            alt={`Portrait de ${talent.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-700/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-350" />

          {/* Verified badge */}
          {talent.verified && (
            <div
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1 shadow-soft"
              aria-label="Talent vérifié"
            >
              <Verified size={12} fill="#10443e" stroke="none" aria-hidden="true" />
              <span className="text-[10px] font-heading font-600 text-forest-700 uppercase tracking-wider">
                Vérifié
              </span>
            </div>
          )}

          {/* Hover CTA */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0">
            <span className="btn-primary w-full justify-center py-2.5 text-sm">
              Voir le profil
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5 flex flex-col gap-3">
          <div>
            <h3 className="font-heading font-700 text-base text-forest-700 truncate">
              {talent.name}
            </h3>
            <p className="font-body text-body-sm text-[#6b7280] mt-0.5">{talent.role}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#6b7280]">
              <MapPin size={12} aria-hidden="true" />
              <span className="text-xs font-body">{talent.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={12} fill="#d4af87" stroke="none" aria-hidden="true" />
              <span className="text-xs font-heading font-600 text-[#1a1a1a]">
                {talent.rating}
              </span>
              <span className="text-xs text-[#9ca3af] font-body">
                ({talent.missions})
              </span>
            </div>
          </div>

          <div className="pt-1 border-t border-[#f0f1ed]">
            <span className="text-xs font-body text-[#9ca3af]">{talent.specialty}</span>
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
    <section id="talents" className="section-padding bg-subtle-gradient">
      <div className="container-xl">
        {/* Header */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <span className="label-tag mb-4 block">Catalogue talents</span>
            <h2 className="heading text-display-md text-forest-700">
              Découvrez nos talents
            </h2>
          </div>
          <Link
            href="/talents"
            className="btn-outline shrink-0 text-sm py-2.5"
            aria-label="Voir tous les talents WeAct"
          >
            Voir tous les talents
            <ArrowRight size={15} aria-hidden="true" />
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
                className={`px-4 py-2 rounded-full text-sm font-heading font-500 transition-all duration-250 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700 ${
                  activeCategory === cat
                    ? "bg-forest-700 text-white shadow-medium"
                    : "bg-white text-[#4a4a4a] border border-[#dde0dc] hover:border-forest-400 hover:text-forest-700"
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
            className="text-center py-20 text-[#9ca3af] font-body"
          >
            Aucun talent dans cette catégorie pour le moment.
          </motion.div>
        )}
      </div>
    </section>
  );
}
