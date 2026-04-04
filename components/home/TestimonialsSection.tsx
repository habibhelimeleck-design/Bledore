"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: "Mr Wils.",
    role: "Création de contenu, Libreville",
    quote:
      "Avant E.Talent, je cherchais des évènements à couvrir — réseaux sociaux, bouche-à-oreille… Maintenant, les opportunités viennent directement à moi. J'ai réalisé 8 missions en 3 mois !",
    rating: 5,
    image: "/1.jpg",
    missions: "18 missions",
    type: "talent",
  },
  {
    name: "Gérard Bourobou",
    role: "Entrepreneur digital, Libreville",
    quote:
      "On perd un temps fou à chercher des talents en dehors de E.Talent. Ici, je filtre exactement par ce que je cherche, je contacte directement. Notre dernier clip a été casté en moins de 48h.",
    rating: 5,
    image: "/7.jpg",
    missions: "23 castings publiés",
    type: "recruteur",
  },
  {
    name: "Sèlomè H.",
    role: "Artiste vocale, Franceville",
    quote:
      "La plateforme est simple, belle et vraiment utile. Le paiement sécurisé, c'est ce qui m'a convaincue. Je n'ai jamais eu de problème.",
    rating: 5,
    image: "/5.jpg",
    missions: "9 missions",
    type: "talent",
  },
];

/* Fang diamonds — same as TalentsSection */
const FANG_BG_SVG = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,2 L38,20 L20,38 L2,20 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.6'/%3E%3Cpath d='M20,9 L31,20 L20,31 L9,20 Z' fill='none' stroke='rgba(212,168,67,1)' stroke-width='0.3'/%3E%3Ccircle cx='20' cy='20' r='1.2' fill='rgba(38,208,124,1)'/%3E%3C/svg%3E")`;

/* ─────────────────────────────────────────────
   STAR ROW — each star animates in stagger
───────────────────────────────────────────── */
function StarRow({ rating, inView }: { rating: number; inView: boolean }) {
  return (
    <div className="flex gap-1.5" aria-label={`Note: ${rating} étoiles sur 5`}>
      {Array.from({ length: rating }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, rotate: -20 }}
          animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{
            duration: 0.35,
            delay: 0.2 + i * 0.07,
            ease: [0.34, 1.56, 0.64, 1], /* spring-like overshoot */
          }}
        >
          <Star size={15} fill="#d4af87" stroke="none" aria-hidden="true" />
        </motion.div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   TESTIMONIAL CARD
───────────────────────────────────────────── */
function TestimonialCard({
  t,
  index,
}: {
  t: (typeof TESTIMONIALS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -5 }}
      className="group flex flex-col gap-5 p-8 rounded-2xl h-full transition-shadow duration-300"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 0 0 0 rgba(38,208,124,0)",
      }}
      /* ring glow on hover via CSS var isn't possible inline — using whileHover animate */
    >
      {/* Large typographic quote mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay: index * 0.12 + 0.1, ease: "easeOut" }}
        className="font-heading text-[4rem] leading-[0.7] select-none"
        style={{ color: "#26d07c", fontStyle: "italic", opacity: 0.55 }}
        aria-hidden="true"
      >
        "
      </motion.div>

      {/* Stars */}
      <StarRow rating={t.rating} inView={inView} />

      {/* Quote */}
      <blockquote
        className="font-heading font-400 text-[1.0625rem] leading-[1.7] flex-1"
        style={{ fontStyle: "italic", color: "rgba(255,255,255,0.72)" }}
      >
        {t.quote}
      </blockquote>

      {/* Author */}
      <div
        className="flex items-center gap-3 pt-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Avatar + pulse ring */}
        <div className="relative shrink-0">
          <div className="relative w-11 h-11 rounded-full overflow-hidden">
            <Image
              src={t.image}
              alt={`Photo de ${t.name}`}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          {/* Pulse ring */}
          <motion.div
            className="absolute -inset-1 rounded-full pointer-events-none"
            style={{ border: "1px solid rgba(38,208,124,0.45)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.45, 0, 0.45] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.8 }}
          />
        </div>

        <div>
          <p className="font-heading font-600 text-[0.9375rem] text-white">{t.name}</p>
          <p
            className="font-mono text-[0.6875rem] tracking-[0.04em] mt-0.5"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            {t.role}
          </p>
        </div>

        {/* Mission count badge */}
        <div className="ml-auto shrink-0">
          <span
            className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(38,208,124,0.1)",
              color: "#7de8b4",
              border: "1px solid rgba(38,208,124,0.2)",
            }}
          >
            {t.missions}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────── */
export default function TestimonialsSection() {
  return (
    <section
      className="section-padding overflow-hidden relative"
      style={{ background: "#030f0a", color: "#ffffff" }}
    >
      {/* Fang texture background — same as TalentsSection */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: FANG_BG_SVG,
          backgroundSize: "40px 40px",
          opacity: 0.022,
        }}
      />

      {/* Radial glow center-top */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(38,208,124,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container-xl relative z-10">

        {/* ── Section header ── */}
        <AnimatedSection className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">
            Témoignages
          </span>

          {/* Aggregate rating badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8"
            style={{ background: "rgba(38,208,124,0.08)", border: "1px solid rgba(38,208,124,0.16)" }}
          >
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} fill="#d4af87" stroke="none" aria-hidden="true" />
              ))}
            </div>
            <span className="font-mono text-[0.625rem] tracking-[0.14em] uppercase text-em-300">
              4,9 / 5 · 120+ avis vérifiés
            </span>
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#26d07c" }}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <h2
            className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-white"
            style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}
          >
            Ils nous font{" "}
            <em style={{ fontStyle: "italic", color: "#26d07c" }}>confiance</em>
          </h2>
        </AnimatedSection>

        {/* ── Mobile — snap scroll ── */}
        <div className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 pb-4 -mx-5 px-5 hide-scrollbar">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="snap-center shrink-0 w-[85vw]">
              <div
                className="p-6 rounded-2xl flex flex-col gap-4 h-full"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="font-heading text-[3rem] leading-[0.7] select-none"
                  style={{ color: "#26d07c", fontStyle: "italic", opacity: 0.55 }}
                  aria-hidden="true"
                >
                  "
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star key={si} size={13} fill="#d4af87" stroke="none" aria-hidden="true" />
                  ))}
                </div>
                <blockquote
                  className="font-heading font-400 text-[1rem] leading-[1.65] flex-1"
                  style={{ fontStyle: "italic", color: "rgba(255,255,255,0.7)" }}
                >
                  {t.quote}
                </blockquote>
                <div
                  className="flex items-center gap-3 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image src={t.image} alt={`Photo de ${t.name}`} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <p className="font-heading font-600 text-[0.9375rem] text-white">{t.name}</p>
                    <p className="font-mono text-[0.6875rem] tracking-[0.04em]" style={{ color: "rgba(255,255,255,0.38)" }}>
                      {t.role}
                    </p>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span
                      className="font-mono text-[0.5625rem] tracking-[0.1em] uppercase px-2 py-1 rounded-full"
                      style={{ background: "rgba(38,208,124,0.1)", color: "#7de8b4", border: "1px solid rgba(38,208,124,0.2)" }}
                    >
                      {t.missions}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Desktop — animated grid ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}