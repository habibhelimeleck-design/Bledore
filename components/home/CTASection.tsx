"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Briefcase } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function CTASection() {
  return (
    <section
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ background: "#030f0a" }}
      aria-labelledby="cta-title"
    >
      {/* Radial gradient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 20% 50%, rgba(6,61,30,.5) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 30%, rgba(26,204,138,.05) 0%, transparent 60%)",
        }}
      />

      <div className="container-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — text */}
          <AnimatedSection>
            <span
              className="mb-8 inline-flex items-center gap-2"
              style={{
                fontFamily: "var(--f-mono, 'DM Mono', monospace)",
                fontSize: "0.6875rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#26d07c",
              }}
            >
              Rejoindre E.Talent
            </span>

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
              Votre carrière
              <br />
              commence
              <br />
              <em style={{ fontStyle: "italic", color: "#26d07c" }}>ici.</em>
            </h2>

            <p
              className="mb-10"
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,.45)",
                lineHeight: 1.75,
                fontWeight: 300,
                maxWidth: "400px",
              }}
            >
              Gratuit, sans engagement. Créez votre profil en 5 minutes et
              rejoignez la communauté E.Talent au Gabon.
            </p>

            <div className="flex flex-col sm:flex-row gap-3.5 mb-4">
              <Link
                href="/inscription/talent"
                className="inline-flex items-center gap-2 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  padding: "1rem 2rem",
                  fontSize: "0.9375rem",
                  background: "#26d07c",
                  color: "#030f0a",
                }}
              >
                <Users size={16} aria-hidden="true" />
                Je suis un talent
              </Link>
              <Link
                href="/inscription/recruteur"
                className="inline-flex items-center gap-2 rounded-full font-medium transition-all duration-300 hover:bg-white/10"
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
            </div>

            <p
              style={{
                fontSize: "0.8125rem",
                color: "rgba(255,255,255,.35)",
                marginTop: "1rem",
              }}
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
            </p>
          </AnimatedSection>

          {/* Right — editorial image collage */}
          <motion.div
            className="relative h-[500px] hidden lg:block"
            aria-hidden="true"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Image 1 */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{ width: 260, height: 360, borderRadius: 16 }}
            >
              <img
                src="/3.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image 2 */}
            <div
              className="absolute bottom-0 right-0 overflow-hidden"
              style={{ width: 200, height: 280, borderRadius: 12 }}
            >
              <img
                src="/4.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Glassmorphism stat tag */}
            <div
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
            >
              <strong
                style={{
                  fontFamily: "var(--f-disp, 'Cormorant Garamond', serif)",
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
                  fontFamily: "var(--f-mono, 'DM Mono', monospace)",
                  fontSize: "0.6875rem",
                  color: "rgba(255,255,255,.4)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginTop: "0.25rem",
                }}
              >
                Castings ouverts
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}