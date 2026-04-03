"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Users, Briefcase, TrendingUp } from "lucide-react";

type Mode = "face" | "producteur";

const HERO_CONTENT = {
  face: {
    eyebrow: "Pour les talents",
    title:   "Votre talent mérite\nd'être vu.",
    subtitle:
      "Créez votre profil, partagez vos compétences et soyez découvert par des producteurs, marques et créateurs à travers le Bénin et l'Afrique.",
    cta:     "Créer mon profil gratuit",
    ctaHref: "/inscription/face",
    secondary:      "Voir les missions",
    secondaryHref:  "#missions",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=85",
    stat1: { value: "2 400+", label: "Talents inscrits" },
    stat2: { value: "340+",   label: "Missions réalisées" },
    stat3: { value: "4.9",    label: "Note moyenne", icon: Star },
  },
  producteur: {
    eyebrow: "Pour les producteurs",
    title:   "Trouvez le talent\nparfait, vite.",
    subtitle:
      "Accédez à un catalogue de talents vérifiés. Publiez vos castings, gérez les candidatures et collaborez avec les meilleures faces du Bénin.",
    cta:     "Publier un casting",
    ctaHref: "/inscription/producteur",
    secondary:      "Voir les talents",
    secondaryHref:  "#talents",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=85",
    stat1: { value: "120+",  label: "Producteurs actifs" },
    stat2: { value: "85%",   label: "Casting réussi" },
    stat3: { value: "48h",   label: "Délai moyen",   icon: TrendingUp },
  },
};

export default function HeroSection() {
  const [mode, setMode] = useState<Mode>("face");
  const content = HERO_CONTENT[mode];

  return (
    <section className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-subtle-gradient pt-24 pb-16">
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-forest-100/60 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-forest-200/40 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] rounded-full bg-gold-light/20 blur-3xl" />
      </div>

      <div className="container-xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Left Column ── */}
          <div className="flex flex-col gap-8">

            {/* Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex"
            >
              <div
                role="group"
                aria-label="Choisissez votre profil"
                className="flex p-1 bg-white/80 backdrop-blur-sm rounded-xl border border-[#dde0dc] shadow-soft w-fit"
              >
                {(["face", "producteur"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    aria-pressed={mode === m}
                    className={`relative px-5 py-2.5 rounded-lg text-sm font-heading font-600 transition-all duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-forest-700 ${
                      mode === m
                        ? "text-white shadow-medium"
                        : "text-[#6b7280] hover:text-forest-700"
                    }`}
                  >
                    {mode === m && (
                      <motion.span
                        layoutId="toggle-pill"
                        className="absolute inset-0 bg-forest-700 rounded-lg"
                        style={{ zIndex: -1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {m === "face" ? (
                        <Users size={15} aria-hidden="true" />
                      ) : (
                        <Briefcase size={15} aria-hidden="true" />
                      )}
                      {m === "face" ? "Je suis une face" : "Je suis producteur"}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Eyebrow */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${mode}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex flex-col gap-6"
              >
                <span className="label-tag">{content.eyebrow}</span>

                <h1 className="heading-display text-[clamp(2.75rem,5.5vw,4.75rem)] text-forest-700 whitespace-pre-line">
                  {content.title}
                </h1>

                <p className="font-body text-body-xl text-[#4a4a4a] max-w-[520px] leading-relaxed">
                  {content.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link href={content.ctaHref} className="btn-primary group">
                    {content.cta}
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="group-hover:translate-x-1 transition-transform duration-200"
                    />
                  </Link>
                  <Link href={content.secondaryHref} className="btn-outline">
                    {content.secondary}
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap gap-6 pt-4 border-t border-[#dde0dc]">
                  {[content.stat1, content.stat2, content.stat3].map((stat, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="font-heading font-700 text-2xl text-forest-700">
                        {stat.value}
                      </span>
                      <span className="font-body text-body-sm text-[#6b7280]">
                        {stat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right Column: Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-strong">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`img-${mode}`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{   opacity: 0 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={content.image}
                    alt={mode === "face" ? "Talent WeAct" : "Producteur WeAct"}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 0px, 50vw"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-700/50 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-white/80 shadow-strong"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-100 flex items-center justify-center shrink-0">
                    <Star size={18} fill="#d4af87" stroke="#d4af87" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-heading font-600 text-sm text-forest-700">
                      {mode === "face" ? "Amina K. — Actrice" : "Studio Lumière — Producteur"}
                    </p>
                    <p className="font-body text-body-sm text-[#6b7280]">
                      {mode === "face"
                        ? "3 missions réalisées ce mois"
                        : "12 talents recrutés cette semaine"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative dot grid */}
            <div
              aria-hidden="true"
              className="absolute -right-6 -bottom-6 w-32 h-32 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #10443e 1.5px, transparent 1.5px)",
                backgroundSize: "12px 12px",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="label text-[10px] text-[#9ca3af] tracking-widest uppercase">
          Défiler
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-[#ccc] flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-1.5 rounded-full bg-[#aaa]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
