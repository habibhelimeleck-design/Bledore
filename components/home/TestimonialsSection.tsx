"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const TESTIMONIALS = [
  {
    name: "Amina K.",
    role: "Actrice, Libreville",
    quote:
      "Avant E.Talent, je cherchais des castings partout — réseaux sociaux, bouche-à-oreille... Maintenant, les opportunités viennent directement à moi. J'ai réalisé 8 missions en 3 mois !",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    missions: "18 missions",
  },
  {
    name: "Marc D.",
    role: "Directeur artistique, Studio Lumière",
    quote:
      "On perd un temps fou à chercher des talents en dehors de E.Talent. Ici, je filtre exactement par ce que je cherche, je contacte directement. Notre dernier clip a été casté en moins de 48h.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    missions: "23 castings publiés",
  },
  {
    name: "Sèlomè H.",
    role: "Artiste vocale, Franceville",
    quote:
      "La plateforme est simple, belle et vraiment utile. Le paiement sécurisé, c'est ce qui m'a convaincue. Je n'ai jamais eu de problème.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    missions: "9 missions",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding" style={{ background: "#f5f4f0", color: "#030f0a" }}>
      <div className="container-xl">
        <AnimatedSection className="text-center max-w-xl mx-auto mb-14">
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">Témoignages</span>
          <h2 className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-ink" style={{ fontSize: "clamp(2.25rem,4vw,4rem)" }}>
            Ils nous font <em style={{ fontStyle: "italic", color: "#1a9958" }}>confiance</em>
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i}>
              <div className="p-8 rounded-2xl bg-white flex flex-col gap-5 h-full transition-all duration-350 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.08)]" style={{ border: "1px solid #e8e6df" }}>
                {/* Stars */}
                <div className="flex gap-1" aria-label={`Note: ${t.rating} étoiles sur 5`}>
                  {Array.from({ length: t.rating }).map((_, si) => (
                    <Star
                      key={si}
                      size={14}
                      fill="#d4af87"
                      stroke="none"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="font-heading font-400 text-[1.125rem] leading-[1.6] flex-1" style={{ fontStyle: "italic", color: "#3a3832" }}>
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid #e8e6df" }}>
                  <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={t.image}
                      alt={`Photo de ${t.name}`}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <p className="font-heading font-600 text-[1rem] text-ink">{t.name}</p>
                    <p className="font-mono text-[0.75rem] tracking-[0.04em]" style={{ color: "#9a9890" }}>{t.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="font-mono text-[0.625rem] tracking-[0.1em] uppercase px-2.5 py-1 rounded-full" style={{ background: "#eefaf4", color: "#0d6637", border: "1px solid #b8f4d6" }}>{t.missions}</span>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
