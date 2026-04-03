"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, Briefcase } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export default function CTASection() {
  return (
    <section className="section-padding bg-cream-200">
      <div className="container-xl">
        <AnimatedSection>
          <div className="relative rounded-3xl overflow-hidden bg-forest-gradient p-12 md:p-16 lg:p-20 text-center">
            {/* Background decoration */}
            <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-forest-600/30 blur-2xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
            </div>

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-2xl mx-auto">
              <span className="label-gold">Rejoignez WeAct</span>

              <h2 className="heading-display text-[clamp(2rem,4vw,3.5rem)] text-white">
                Votre carrière commence{" "}
                <span className="text-gold-DEFAULT">maintenant.</span>
              </h2>

              <p className="font-body text-body-xl text-forest-200 leading-relaxed">
                Gratuit, rapide, sans engagement. Créez votre profil en 5 minutes et rejoignez
                la communauté WeAct.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/inscription/face" className="btn-gold group">
                  <Users size={17} aria-hidden="true" />
                  Je suis un talent
                  <ArrowRight
                    size={15}
                    aria-hidden="true"
                    className="group-hover:translate-x-1 transition-transform duration-200"
                  />
                </Link>
                <Link href="/inscription/producteur" className="btn-outline border-white/40 text-white hover:bg-white hover:text-forest-700">
                  <Briefcase size={17} aria-hidden="true" />
                  Je suis producteur
                </Link>
              </div>

              <p className="font-body text-xs text-forest-300 mt-2">
                Déjà membre ?{" "}
                <Link
                  href="/connexion"
                  className="text-gold-light underline underline-offset-2 hover:text-white transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
