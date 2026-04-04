"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, Users, Briefcase, TrendingUp, MapPin } from "lucide-react";

type Mode = "talent" | "recruteur";

/* ─────────────────────────────────────────────
   CONTENT
───────────────────────────────────────────── */
const HERO_CONTENT = {
  talent: {
    eyebrow: "Pour les talents",
    titleLines: ["Votre talent", "mérite d'être vu."],
    subtitle:
      "Créez votre profil, partagez vos compétences et soyez découvert par des recruteurs, marques et créateurs à travers le Gabon et l'Afrique centrale.",
    cta: "Créer mon profil gratuit",
    ctaHref: "/inscription/talent",
    secondary: "Voir les missions",
    secondaryHref: "#missions",
    image: "/1.jpg",
    stats: [
      { raw: 2400, suffix: "+", label: "Talents inscrits", decimal: false },
      { raw: 340, suffix: "+", label: "Missions réalisées", decimal: false },
      { raw: 49, suffix: "", label: "Note moyenne", decimal: true, icon: Star },
    ],
    badge: { name: "Mathias Asseko", sub: "3 missions ce mois" },
  },
  recruteur: {
    eyebrow: "Pour les recruteurs",
    titleLines: ["Trouvez le talent", "parfait, vite."],
    subtitle:
      "Accédez à un catalogue de talents vérifiés. Publiez vos castings, gérez les candidatures et collaborez avec les meilleurs talents du Gabon.",
    cta: "Publier un casting",
    ctaHref: "/inscription/recruteur",
    secondary: "Voir les talents",
    secondaryHref: "#talents",
    image: "/2.jpg",
    stats: [
      { raw: 120, suffix: "+", label: "Recruteurs actifs", decimal: false },
      { raw: 85, suffix: "%", label: "Casting réussi", decimal: false },
      { raw: 48, suffix: "h", label: "Délai moyen", decimal: false, icon: TrendingUp },
    ],
    badge: { name: "Studio Lumière", sub: "12 talents cette semaine" },
  },
};

/* ─────────────────────────────────────────────
   COUNTER HOOK
───────────────────────────────────────────── */
function useCounter(target: number, duration = 1800, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let id: number;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * target));
      if (p < 1) id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [target, duration, active]);
  return count;
}

/* ─────────────────────────────────────────────
   STAT COUNTER COMPONENT
───────────────────────────────────────────── */
function StatCounter({
  raw,
  suffix,
  decimal,
}: {
  raw: number;
  suffix: string;
  decimal: boolean;
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setActive(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // For decimals like 4.9: store as 49, display as "4.9"
  const count = useCounter(raw, 1800, active);
  const display = decimal
    ? (count / 10).toFixed(1)
    : count.toLocaleString("fr-FR");

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* ─────────────────────────────────────────────
   CANVAS — FOREST CANOPY PARTICLES
───────────────────────────────────────────── */
function ForestParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    type Particle = {
      x: number; y: number; r: number;
      vx: number; vy: number;
      opacity: number; color: string;
      life: number; lifeSpeed: number;
    };

    const makeParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      r: Math.random() * 2.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.35 + 0.05),
      opacity: Math.random() * 0.45 + 0.05,
      color: Math.random() > 0.65 ? "#d4a843" : "#26d07c",
      life: Math.random(),
      lifeSpeed: Math.random() * 0.003 + 0.001,
    });

    const particles: Particle[] = Array.from({ length: 55 }, makeParticle);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life += p.lifeSpeed;

        if (p.y < -10 || p.life >= 1) Object.assign(p, makeParticle());

        const fade =
          p.life < 0.2
            ? p.life / 0.2
            : p.life > 0.8
            ? (1 - p.life) / 0.2
            : 1;
        const a = p.opacity * fade;
        const hex = Math.floor(a * 255)
          .toString(16)
          .padStart(2, "0");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + hex;
        ctx.fill();

        if (p.r > 1.4) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
          const glowHex = Math.floor(a * 60)
            .toString(16)
            .padStart(2, "0");
          g.addColorStop(0, p.color + glowHex);
          g.addColorStop(1, "transparent");
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
      style={{ mixBlendMode: "screen", opacity: 0.65 }}
    />
  );
}

/* ─────────────────────────────────────────────
   SVG — BOTANICAL LEAF
───────────────────────────────────────────── */
function LeafSVG({
  w = 70,
  h = 96,
  opacity = 0.45,
  flip = false,
}: {
  w?: number;
  h?: number;
  opacity?: number;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 60 80"
      width={w}
      height={h}
      aria-hidden="true"
      style={{ opacity, transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Main leaf silhouette */}
      <path
        d="M30,4 C46,4 56,20 56,40 C56,60 46,76 30,76 C14,76 4,60 4,40 C4,20 14,4 30,4 Z"
        fill="none"
        stroke="rgba(38,208,124,0.35)"
        strokeWidth="0.8"
      />
      {/* Midrib */}
      <line x1="30" y1="4" x2="30" y2="76" stroke="rgba(38,208,124,0.2)" strokeWidth="0.5" />
      {/* Veins */}
      {[18, 28, 38, 48, 58].map((y, i) => (
        <line
          key={i}
          x1="30"
          y1={y}
          x2={i % 2 === 0 ? 44 : 16}
          y2={y + 6}
          stroke="rgba(38,208,124,0.12)"
          strokeWidth="0.4"
        />
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   SVG — FANG GEOMETRIC DIVIDER
───────────────────────────────────────────── */
function FangDivider() {
  return (
    <svg
      viewBox="0 0 480 16"
      width="100%"
      height="16"
      aria-hidden="true"
      preserveAspectRatio="xMinYMid meet"
      style={{ maxWidth: 420 }}
    >
      {Array.from({ length: 24 }, (_, i) => {
        const cx = i * 20 + 10;
        return (
          <g key={i}>
            {/* Outer diamond */}
            <path
              d={`M${cx},1 L${cx + 8},8 L${cx},15 L${cx - 8},8 Z`}
              fill="none"
              stroke="rgba(38,208,124,0.22)"
              strokeWidth="0.6"
            />
            {/* Inner diamond */}
            <path
              d={`M${cx},4 L${cx + 5},8 L${cx},12 L${cx - 5},8 Z`}
              fill="none"
              stroke="rgba(212,168,67,0.14)"
              strokeWidth="0.5"
            />
            {/* Center dot */}
            <circle cx={cx} cy={8} r="0.9" fill="rgba(38,208,124,0.28)" />
          </g>
        );
      })}
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MOTION VARIANTS
───────────────────────────────────────────── */
const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const wordItem = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.52, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

/* ─────────────────────────────────────────────
   HERO SECTION
───────────────────────────────────────────── */
export default function HeroSection() {
  const [mode, setMode] = useState<Mode>("talent");
  const content = HERO_CONTENT[mode];

  /* Mouse parallax */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 45, damping: 18 });
  const my = useSpring(rawY, { stiffness: 45, damping: 18 });

  /* Pre-computed parallax transforms */
  const leaf1x = useTransform(mx, [-0.5, 0.5], [-18, 18]);
  const leaf1y = useTransform(my, [-0.5, 0.5], [-12, 12]);
  const leaf2x = useTransform(mx, [-0.5, 0.5], [12, -12]);
  const leaf2y = useTransform(my, [-0.5, 0.5], [10, -10]);
  const leaf3x = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const leaf3y = useTransform(my, [-0.5, 0.5], [-14, 14]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - r.left - r.width / 2) / r.width);
      rawY.set((e.clientY - r.top - r.height / 2) / r.height);
    },
    [rawX, rawY]
  );

  return (
    <section
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden bg-ink pt-[72px]"
      onMouseMove={handleMouseMove}
    >
      {/* ── Forest canopy particles ── */}
      <ForestParticles />

      {/* ── Background layers ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-0">
        {/* Hero image with ken-burns */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`bg-${mode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75 }}
            className="absolute right-0 top-0 w-[55%] h-full hidden lg:block"
          >
            <motion.div
              className="w-full h-full"
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 14, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
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
          </motion.div>
        </AnimatePresence>

        {/* Gradient vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-transparent hidden lg:block" />
        <div className="absolute inset-0 bg-ink/82 lg:hidden" />

        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "200px",
          }}
        />

        {/* Animated emerald orbs */}
        <motion.div
          className="absolute -top-32 -left-48 w-[600px] h-[600px] rounded-full hidden lg:block"
          style={{
            background: "radial-gradient(circle, #0d6637 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.32, 0.44, 0.32] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full hidden lg:block"
          style={{
            background: "radial-gradient(circle, #063d1e 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
          animate={{ scale: [1, 1.22, 1], opacity: [0.18, 0.28, 0.18] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
        />
        {/* Gold orb — Gabon flag touch */}
        <motion.div
          className="absolute top-1/2 left-1/3 w-[360px] h-[360px] rounded-full hidden lg:block"
          style={{
            background: "radial-gradient(circle, #d4a843 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.11, 0.06] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      {/* ── Floating botanical leaves (parallax) ── */}
      <motion.div
        aria-hidden="true"
        className="absolute top-[28%] right-[46%] hidden lg:block pointer-events-none z-[2]"
        style={{ x: leaf1x, y: leaf1y }}
      >
        <motion.div
          animate={{ rotate: [0, 6, -4, 0], y: [0, -9, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
        >
          <LeafSVG w={80} h={108} opacity={0.55} />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-[30%] right-[40%] hidden lg:block pointer-events-none z-[2]"
        style={{ x: leaf2x, y: leaf2y }}
      >
        <motion.div
          animate={{ rotate: [0, -7, 3, 0], y: [0, 7, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        >
          <LeafSVG w={48} h={65} opacity={0.3} flip />
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute top-[18%] right-[52%] hidden xl:block pointer-events-none z-[2]"
        style={{ x: leaf3x, y: leaf3y }}
      >
        <motion.div
          animate={{ rotate: [0, 4, -6, 0], y: [0, -6, 3, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }}
        >
          <LeafSVG w={36} h={50} opacity={0.22} />
        </motion.div>
      </motion.div>

      {/* ── Main content ── */}
      <div className="container-xl relative z-10 py-16">
        <div className="max-w-[575px]">

          {/* Toggle pill */}
          <motion.div {...fadeUp(0.1)} className="mb-8">
            <div
              role="group"
              aria-label="Choisissez votre profil"
              className="inline-flex p-1 rounded-full gap-0.5"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
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
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
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

          {/* Mode-switching content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${mode}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex flex-col gap-6"
            >
              {/* Eyebrow + geo anchor */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-px bg-em-400 shrink-0" />
                  <span className="font-mono text-[0.6875rem] tracking-[0.16em] uppercase text-em-400">
                    {content.eyebrow}
                  </span>
                </div>
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="flex items-center gap-1.5 shrink-0"
                  style={{ color: "rgba(212,168,67,0.65)" }}
                >
                  <MapPin size={9} aria-hidden="true" />
                  <span className="font-mono text-[0.5625rem] tracking-[0.16em] uppercase">
                    Libreville · Gabon
                  </span>
                </motion.div>
              </div>

              {/* Title — word-by-word stagger */}
              <motion.h1
                className="font-heading font-600 text-white leading-[0.95] tracking-[-0.02em]"
                style={{ fontSize: "clamp(3.25rem,6vw,6rem)" }}
                variants={wordContainer}
                initial="hidden"
                animate="show"
              >
                {content.titleLines.map((line, li) => (
                  <span key={li} className="block">
                    {line.split(" ").map((word, wi) => (
                      <motion.span
                        key={`${li}-${wi}`}
                        variants={wordItem}
                        className="inline-block"
                        style={{ marginRight: "0.22em", willChange: "transform, opacity, filter" }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48, duration: 0.52 }}
                className="font-body text-[1.0625rem] font-300 leading-[1.75] max-w-[465px]"
                style={{ color: "rgba(255,255,255,0.52)" }}
              >
                {content.subtitle}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.5 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <Link
                  href={content.ctaHref}
                  className="inline-flex items-center gap-2 px-[1.75rem] py-[0.875rem] rounded-full font-600 text-[0.875rem] bg-em-400 text-ink hover:bg-em-300 transition-all duration-300 hover:-translate-y-px hover:shadow-[0_8px_32px_rgba(38,208,124,0.35)] group"
                >
                  {content.cta}
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
                <Link
                  href={content.secondaryHref}
                  className="inline-flex items-center gap-2 px-[1.75rem] py-[0.875rem] rounded-full font-500 text-[0.875rem] transition-all duration-300 hover:gap-3"
                  style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.7)" }}
                >
                  {content.secondary}
                </Link>
              </motion.div>

              {/* Fang-pattern divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.72, duration: 0.9 }}
              >
                <FangDivider />
              </motion.div>

              {/* Stats with counters */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.78, duration: 0.5 }}
                className="flex flex-wrap gap-8 pt-1"
              >
                {content.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span
                      className="font-heading font-600 text-white leading-none tracking-[-0.02em]"
                      style={{ fontSize: "clamp(1.75rem,3vw,2.05rem)" }}
                    >
                      <StatCounter
                        raw={stat.raw}
                        suffix={stat.suffix}
                        decimal={stat.decimal}
                      />
                    </span>
                    <span
                      className="font-mono text-[0.6875rem] tracking-[0.15em] uppercase"
                      style={{ color: "rgba(255,255,255,0.38)" }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Floating badge (bottom-right) ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="absolute bottom-12 right-12 hidden lg:block z-10"
      >
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 rounded-[14px] pointer-events-none"
          style={{ border: "1px solid rgba(38,208,124,0.4)" }}
          animate={{ scale: [1, 1.09, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
        />
        {/* Second delayed ring */}
        <motion.div
          className="absolute inset-0 rounded-[14px] pointer-events-none"
          style={{ border: "1px solid rgba(38,208,124,0.2)" }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.7 }}
        />
        <div
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
                style={{
                  background: "rgba(38,208,124,0.15)",
                  border: "1px solid rgba(38,208,124,0.22)",
                }}
              >
                <span className="text-[0.6875rem]">⭐</span>
              </div>
              <div>
                <p className="font-heading font-600 text-sm text-white">
                  {content.badge.name}
                </p>
                <p
                  className="font-mono text-[0.6875rem] tracking-[0.04em]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {content.badge.sub}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 hidden lg:flex"
        aria-hidden="true"
      >
        <span
          className="font-mono text-[0.625rem] tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.28)" }}
        >
          Défiler
        </span>
        <div
          className="w-12 h-px overflow-hidden relative"
          style={{ background: "rgba(255,255,255,0.18)" }}
        >
          <motion.div
            className="absolute top-0 left-0 h-full bg-em-400"
            style={{ width: "100%" }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}