"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

const TESTIMONIALS = [
  {
    name: "Amina K.",
    role: "Actrice, Cotonou",
    quote:
      "Avant WeAct, je cherchais des castings partout — réseaux sociaux, bouche-à-oreille... Maintenant, les opportunités viennent directement à moi. J'ai réalisé 8 missions en 3 mois !",
    rating: 5,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
    missions: "18 missions",
  },
  {
    name: "Marc D.",
    role: "Directeur artistique, Studio Lumière",
    quote:
      "On perd un temps fou à chercher des talents en dehors de WeAct. Ici, je filtre exactement par ce que je cherche, je contacte directement. Notre dernier clip a été casté en moins de 48h.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    missions: "23 castings publiés",
  },
  {
    name: "Sèlomè H.",
    role: "Artiste vocale, Abomey-Calavi",
    quote:
      "La plateforme est simple, belle et vraiment utile. Le paiement sécurisé, c'est ce qui m'a convaincue. Je n'ai jamais eu de problème.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80",
    missions: "9 missions",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-xl">
        <AnimatedSection className="text-center max-w-xl mx-auto mb-14">
          <span className="label-tag mb-4 block">Témoignages</span>
          <h2 className="heading text-display-md text-forest-700">
            Ils nous font confiance
          </h2>
        </AnimatedSection>

        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <StaggerItem key={i}>
              <div className="card-premium p-7 flex flex-col gap-5 h-full">
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
                <blockquote className="font-body text-body-lg text-[#4a4a4a] leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#f0f1ed]">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={t.image}
                      alt={`Photo de ${t.name}`}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div>
                    <p className="font-heading font-600 text-sm text-forest-700">{t.name}</p>
                    <p className="font-body text-xs text-[#9ca3af]">{t.role}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="label-tag text-[10px] px-2 py-0.5">{t.missions}</span>
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
