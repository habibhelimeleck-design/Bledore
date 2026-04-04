"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  LayoutGroup,
} from "framer-motion";
import Link from "next/link";
import { MapPin, Clock, Banknote, ArrowRight } from "lucide-react";
import { formatXAF } from "@/lib/utils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface ProducerAccount {
  company_name: string | null;
  is_verified: boolean;
}
interface MissionProfile {
  full_name: string | null;
  producer_accounts: ProducerAccount | null;
}
export interface Mission {
  id: string;
  title: string;
  category: string;
  location: string | null;
  is_remote: boolean;
  budget_min: number | null;
  budget_max: number | null;
  currency: string | null;
  deadline: string | null;
  status: string;
  required_skills: string[] | null;
  profiles: MissionProfile | null;
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const CATEGORY_COLORS: Record<string, string> = {
  "Publicité":               "bg-[#eefbf4] text-[#0d6637]",
  "Clip musical":            "bg-purple-50 text-purple-700",
  "Film / Série":            "bg-blue-50 text-blue-700",
  "Défilé / Mode":           "bg-[#fdf8f0] text-[#8b6234]",
  "Photographie":            "bg-pink-50 text-pink-700",
  "Contenu réseaux sociaux": "bg-orange-50 text-orange-700",
  "Voix off":                "bg-blue-50 text-blue-700",
  "Événement":               "bg-green-50 text-green-700",
};

const ORDERED_CATEGORIES = [
  "Publicité",
  "Clip musical",
  "Film / Série",
  "Défilé / Mode",
  "Photographie",
  "Événement",
  "Contenu réseaux sociaux",
  "Voix off",
];

/* Punu-inspired diamond texture — ink on chalk, low opacity */
const PUNU_BG_SVG = `url("data:image/svg+xml,%3Csvg width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M24,3 L45,24 L24,45 L3,24 Z' fill='none' stroke='rgba(3,15,10,1)' stroke-width='0.5'/%3E%3Cpath d='M24,12 L36,24 L24,36 L12,24 Z' fill='none' stroke='rgba(3,15,10,1)' stroke-width='0.3'/%3E%3Ccircle cx='24' cy='24' r='1.4' fill='none' stroke='rgba(3,15,10,1)' stroke-width='0.4'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function daysLeft(deadline: string | null): string {
  if (!deadline) return "Sans délai";
  const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000);
  if (diff < 0)  return "Expiré";
  if (diff === 0) return "Dernier jour";
  if (diff === 1) return "1 jour restant";
  return `${diff} jours restants`;
}

function isUrgent(deadline: string | null): boolean {
  if (!deadline) return false;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000) <= 3;
}

function getMissionMeta(mission: Mission) {
  const producer = mission.profiles?.producer_accounts;
  const brandName = producer?.company_name ?? mission.profiles?.full_name ?? "Recruteur";
  const budget =
    mission.budget_min && mission.budget_max
      ? `${formatXAF(mission.budget_min)} – ${formatXAF(mission.budget_max)}`
      : mission.budget_min
      ? formatXAF(mission.budget_min)
      : "Budget à négocier";
  const locationLabel = mission.is_remote ? "Télétravail possible" : (mission.location ?? "Gabon");
  return { brandName, budget, locationLabel };
}

/* ─────────────────────────────────────────────
   MISSION CARD — stagger reveal + hover glow
───────────────────────────────────────────── */
function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const { brandName, budget, locationLabel } = getMissionMeta(mission);
  const deadline = daysLeft(mission.deadline);
  const urgent = isUrgent(mission.deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Link
        href={`/missions/${mission.id}`}
        className="group flex flex-col gap-4 p-6 rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(3,15,10,0.10)] hover:ring-1 hover:ring-[rgba(38,208,124,0.28)]"
        style={{ border: "1px solid #e8e6df" }}
      >
        {/* Top row: badges + arrow */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${
                CATEGORY_COLORS[mission.category] ?? "bg-gray-50 text-gray-600"
              }`}
            >
              {mission.category}
            </span>
            {urgent && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ background: "#fff4e6", border: "1px solid #ffd8a8" }}
              >
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#c45c00" }}
                  animate={{ scale: [1, 1.55, 1], opacity: [1, 0.38, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                <span
                  className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase"
                  style={{ color: "#c45c00" }}
                >
                  Urgent
                </span>
              </div>
            )}
          </div>

          {/* Arrow — rotates on hover */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-45 group-hover:border-[rgba(38,208,124,0.35)] group-hover:text-em-600 group-hover:bg-[rgba(38,208,124,0.06)]"
            style={{ border: "1px solid #e8e6df", color: "#9a9890" }}
          >
            <ArrowRight size={14} aria-hidden="true" />
          </div>
        </div>

        {/* Title & brand */}
        <div>
          <h3 className="font-heading font-600 text-[1.125rem] text-ink leading-[1.3] tracking-[-0.01em] transition-colors duration-200 group-hover:text-em-700">
            {mission.title}
          </h3>
          <p className="font-body text-[0.8125rem] font-300 mt-1" style={{ color: "#9a9890" }}>
            {brandName}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
            <MapPin size={13} aria-hidden="true" />
            <span className="font-mono text-[0.75rem] tracking-[0.04em]">{locationLabel}</span>
          </div>
          <div
            className="flex items-center gap-1.5 transition-colors duration-200 group-hover:text-em-700"
            style={{ color: "#1a9958" }}
          >
            <Banknote size={13} aria-hidden="true" />
            <span className="font-mono text-[0.75rem] tracking-[0.04em] font-500">{budget}</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
            <Clock size={13} aria-hidden="true" />
            <span className="font-body text-xs">{deadline}</span>
          </div>
        </div>

        {/* Skill tags */}
        {mission.required_skills && mission.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3" style={{ borderTop: "1px solid #e8e6df" }}>
            {mission.required_skills.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="font-mono text-[0.6875rem] tracking-[0.04em] px-2 py-0.5 rounded-full transition-colors duration-200 group-hover:bg-[#eefbf4] group-hover:text-em-700"
                style={{ background: "#f5f4f0", color: "#9a9890" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN — MISSIONS CLIENT
───────────────────────────────────────────── */
export default function MissionsClient({ missions }: { missions: Mission[] }) {
  const [activeCategory, setActiveCategory] = useState("Toutes");

  /* Only surface categories that have at least one mission */
  const availableCategories = [
    "Toutes",
    ...ORDERED_CATEGORIES.filter((cat) => missions.some((m) => m.category === cat)),
  ];

  const filtered =
    activeCategory === "Toutes"
      ? missions
      : missions.filter((m) => m.category === activeCategory);

  return (
    <section
      id="missions"
      className="section-padding overflow-hidden relative"
      style={{ background: "#f5f4f0", color: "#030f0a" }}
    >
      {/* Punu geometric texture — ink at ultra-low opacity on chalk bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: PUNU_BG_SVG,
          backgroundSize: "48px 48px",
          opacity: 0.018,
        }}
      />

      <div className="container-xl relative z-10">

        {/* ── Section header ── */}
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            {/* Eyebrow + live pulse */}
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-600">
                Casting ouverts
              </span>
              {missions.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#26d07c" }}
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.35, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span
                    className="font-mono text-[0.5625rem] tracking-[0.12em] uppercase"
                    style={{ color: "rgba(3,15,10,0.35)" }}
                  >
                    {missions.length} actives
                  </span>
                </div>
              )}
            </div>

            <h2
              className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-ink"
              style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}
            >
              Missions{" "}
              <em style={{ fontStyle: "italic", color: "#1a9958" }}>en cours</em>
            </h2>
            <p
              className="font-body font-300 text-[1rem] leading-[1.75] mt-3 max-w-xl"
              style={{ color: "#3a3832" }}
            >
              Des centaines d'opportunités professionnelles, mises à jour chaque jour.
            </p>
          </div>

          <Link
            href="/missions"
            className="inline-flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.12em] uppercase text-em-700 hover:gap-3 transition-all duration-250 shrink-0"
          >
            Toutes les missions
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </AnimatedSection>

        {/* ── Category filter — desktop spring pill ── */}
        {availableCategories.length > 1 && (
          <AnimatedSection delay={0.1} className="mb-10 hidden sm:block">
            <LayoutGroup id="missions-filter">
              <div
                role="group"
                aria-label="Filtrer par catégorie"
                className="flex flex-wrap gap-2"
              >
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    className={`relative px-4 py-2 rounded-full text-sm font-500 transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-em-400 ${
                      activeCategory === cat
                        ? "text-white"
                        : "text-ink/50 border border-ink/15 hover:border-ink/40 hover:text-ink"
                    }`}
                  >
                    {activeCategory === cat && (
                      <motion.span
                        layoutId="missions-cat-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "#0d6637", zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{cat}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </AnimatedSection>
        )}

        {/* ── Cards ── */}
        {missions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 font-body"
            style={{ color: "rgba(3,15,10,0.35)" }}
          >
            Aucune mission disponible pour le moment.
          </motion.div>
        ) : (
          <>
            {/* Mobile — snap scroll */}
            <div className="flex sm:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-5 px-5 hide-scrollbar">
              {missions.map((mission) => {
                const { brandName, budget, locationLabel } = getMissionMeta(mission);
                const deadline = daysLeft(mission.deadline);
                const urgent = isUrgent(mission.deadline);
                return (
                  <Link
                    key={mission.id}
                    href={`/missions/${mission.id}`}
                    className="snap-start shrink-0 flex flex-col gap-4 p-5 rounded-2xl bg-white"
                    style={{ width: "80vw", border: "1px solid #e8e6df" }}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${
                          CATEGORY_COLORS[mission.category] ?? "bg-gray-50 text-gray-600"
                        }`}
                      >
                        {mission.category}
                      </span>
                      {urgent && (
                        <span
                          className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
                          style={{ background: "#fff4e6", color: "#c45c00", border: "1px solid #ffd8a8" }}
                        >
                          Urgent
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-600 text-[1.0625rem] text-ink leading-[1.3] tracking-[-0.01em]">
                        {mission.title}
                      </h3>
                      <p className="font-body text-[0.8125rem] font-300 mt-1" style={{ color: "#9a9890" }}>
                        {brandName}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                        <MapPin size={12} aria-hidden="true" />
                        <span className="font-mono text-[0.6875rem] tracking-[0.04em]">{locationLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: "#0d6637" }}>
                        <Banknote size={12} aria-hidden="true" />
                        <span className="font-mono text-[0.6875rem] tracking-[0.04em]">{budget}</span>
                      </div>
                      <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                        <Clock size={12} aria-hidden="true" />
                        <span className="font-body text-xs">{deadline}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop — animated grid */}
            <motion.div layout className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((mission, i) => (
                  <MissionCard key={mission.id} mission={mission} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filtered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 font-body"
                style={{ color: "rgba(3,15,10,0.35)" }}
              >
                Aucune mission dans cette catégorie pour le moment.
              </motion.div>
            )}
          </>
        )}

        {/* ── Bottom CTA ── */}
        <AnimatedSection delay={0.3} className="text-center mt-14">
          <motion.div
            whileHover={{ scale: 1.015 }}
            transition={{ duration: 0.2 }}
            className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 rounded-2xl"
            style={{ background: "#063d1e" }}
          >
            <p className="font-body text-[1rem] text-white/80 font-400">
              Vous êtes recruteur ou marque ?
            </p>
            <Link
              href="/inscription/recruteur"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-600 text-[0.875rem] bg-em-400 text-ink hover:bg-em-300 transition-all duration-300 shrink-0"
            >
              Publier un casting gratuit
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  );
}