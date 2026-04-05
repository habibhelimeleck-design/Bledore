"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Briefcase } from "lucide-react";

/* Fang diamond texture — émeraude on dark */
const FANG_BG = `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M32,4 L60,32 L32,60 L4,32 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.5'/%3E%3Cpath d='M32,16 L48,32 L32,48 L16,32 Z' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.3'/%3E%3Ccircle cx='32' cy='32' r='2' fill='none' stroke='rgba(38,208,124,1)' stroke-width='0.4'/%3E%3C/svg%3E")`;

export default function CTASection() {
  const textRef = useRef<HTMLDivElement>(null);
  const inViewText = useInView(textRef, { once: true, margin: "-80px 0px" });

  const titleWords = ["Votre", "carrière", "commence"];

  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "#030f0a" }}
      aria-labelledby="cta-title"
    >
      {/* Fang texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: FANG_BG,
          backgroundSize: "64px 64px",
          opacity: 0.018,
        }}
      />

      {/* Radial gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(6,61,30,.5) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(26,204,138,.05) 0%, transparent 60%)",
        }}
      />

      {/* Orb 1 — émeraude, right collage area */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          background:
            "radial-gradient(circle, rgba(38,208,124,0.13) 0%, transparent 70%)",
          bottom: "15%",
          right: "8%",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1, 1.18, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orb 2 — doré, top center-right */}
      <motion.div
        aria-hidden="true"
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 220,
          height: 220,
          background:
            "radial-gradient(circle, rgba(212,175,135,0.09) 0%, transparent 70%)",
          top: "10%",
          right: "28%",
          filter: "blur(60px)",
        }}
        animate={{ scale: [1, 1.22, 1], opacity: [0.45, 0.75, 0.45] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2.5,
        }}
      />

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left — text ── */}
          <div ref={textRef}>
            <motion.span
              className="mb-8 inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--f-mono, 'DM Mono', monospace)",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#26d07c",
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={inViewText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
            >
              Rejoindre E.Talent
            </motion.span>

            {/* Title — word stagger */}
            <h2
              id="cta-title"
              className="heading-display text-white mb-8"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                fontWeight: 600,
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
              }}
            >
              {titleWords.map((word, wi) => (
                <motion.span
                  key={wi}
                  className="inline-block"
                  style={{ marginRight: "0.25em" }}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={
                    inViewText
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : {}
                  }
                  transition={{
                    duration: 0.5,
                    delay: wi * 0.09,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {word}
                </motion.span>
              ))}
              <br />
              <motion.em
                style={{ fontStyle: "italic", color: "#26d07c", display: "inline-block" }}
                initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                animate={
                  inViewText
                    ? { opacity: 1, y: 0, filter: "blur(0px)" }
                    : {}
                }
                transition={{
                  duration: 0.5,
                  delay: titleWords.length * 0.09,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                ici.
              </motion.em>
            </h2>

            <motion.p
              className="mb-10"
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,.45)",
                lineHeight: 1.75,
                fontWeight: 300,
                maxWidth: "400px",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={inViewText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Gratuit, sans engagement. Créez votre profil en 5 minutes et
              rejoignez la communauté E.Talent au Gabon.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-3.5 mb-4"
              initial={{ opacity: 0, y: 16 }}
              animate={inViewText ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/inscription/talent"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-medium w-full sm:w-auto"
                  style={{
                    padding: "1rem 2rem",
                    fontSize: "0.9375rem",
                    background: "#26d07c",
                    color: "#030f0a",
                    transition: "filter 0.2s ease",
                  }}
                >
                  <Users size={16} aria-hidden="true" />
                  Je suis un talent
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/inscription/recruteur"
                  className="inline-flex items-center justify-center gap-2 rounded-full font-medium w-full sm:w-auto hover:bg-white/10 transition-colors duration-300"
                  style={{
                    padding: "1rem 2rem",
                    fontSize: "0.9375rem",
                    border: "1px solid rgba(255,255,255,.2)",
                    color: "rgba(255,255,255,.7)",
                  }}
                >
                  <Briefcase size={16} aria-hidden="true" />
                  Je suis recruteur
                </Link>
              </motion.div>
            </motion.div>

            <motion.p
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,.35)",
                marginTop: "1rem",
              }}
              initial={{ opacity: 0 }}
              animate={inViewText ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.55 }}
            >
              Déjà membre ?{" "}
              <Link
                href="/connexion"
                className="transition-colors duration-200 hover:text-white"
                style={{
                  color: "#d4af87",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Se connecter
              </Link>
            </motion.p>
          </div>

          {/* Mobile image */}
          <div
            className="block lg:hidden overflow-hidden rounded-2xl"
            style={{ aspectRatio: "16/9" }}
          >
            <img src="/3.jpg" alt="" className="w-full h-full object-cover" />
          </div>

          {/* ── Right — editorial collage (desktop only) ── */}
          <div
            className="relative h-[500px] hidden lg:block"
            aria-hidden="true"
          >
            {/* Image 1 — large, ken-burns */}
            <motion.div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: 260, height: 360, borderRadius: 16 }}
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.img
                src="/3.jpg"
                alt=""
                className="w-full h-full object-cover"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{
                  duration: 14,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>

            {/* Image 2 — small, stagger delayed */}
            <motion.div
              className="absolute bottom-0 right-0 overflow-hidden"
              style={{ width: 200, height: 280, borderRadius: 12 }}
              initial={{ opacity: 0, y: 32, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              <motion.img
                src="/4.jpg"
                alt=""
                className="w-full h-full object-cover"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 16,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3,
                }}
              />
            </motion.div>

            {/* Glassmorphism stat badge */}
            <motion.div
              className="absolute"
              style={{
                top: 200,
                right: 60,
                background: "rgba(255,255,255,.06)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 12,
                padding: "0.875rem 1.25rem",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.45,
                delay: 0.45,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            >
              {/* Pulse dot */}
              <motion.div
                className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full"
                style={{ background: "#26d07c" }}
                animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <strong
                style={{
                  fontFamily:
                    "var(--f-disp, 'Cormorant Garamond', serif)",
                  fontSize: "1.75rem",
                  fontWeight: 600,
                  color: "#26d07c",
                  display: "block",
                }}
              >
                +12
              </strong>
              <p
                style={{
                  fontFamily:
                    "var(--f-mono, 'DM Mono', monospace)",
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,.4)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                }}
              >
                Castings ouverts
              </p>
            </motion.div>

            {/* Botanical leaf SVG — floating accent */}
            <motion.div
              className="absolute pointer-events-none"
              style={{ top: "55%", left: "48%", opacity: 0.18 }}
              animate={{
                y: [0, -8, 0],
                rotate: [-6, 2, -6],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <svg
                width="36"
                height="48"
                viewBox="0 0 36 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 46 C18 46 2 34 2 18 C2 10 10 2 18 2 C26 2 34 10 34 18 C34 34 18 46 18 46Z"
                  fill="none"
                  stroke="#26d07c"
                  strokeWidth="1.2"
                />
                <path
                  d="M18 46 L18 8"
                  stroke="#26d07c"
                  strokeWidth="0.8"
                  opacity="0.5"
                />
                <path
                  d="M18 20 C12 16 8 18 8 18"
                  stroke="#26d07c"
                  strokeWidth="0.6"
                  opacity="0.4"
                />
                <path
                  d="M18 28 C24 24 28 26 28 26"
                  stroke="#26d07c"
                  strokeWidth="0.6"
                  opacity="0.4"
                />
              </svg>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}