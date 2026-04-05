import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/home/NavBar";
import FooterSection from "@/components/home/FooterSection";
import { Check, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "E.Talent est gratuit pour les talents. Découvrez nos offres pour les recruteurs et marques gabonaises.",
};

const PLANS = [
  {
    name: "Talent",
    price: "Gratuit",
    sub: "pour toujours",
    cta: "Créer mon profil",
    href: "/inscription/talent",
    primary: false,
    features: [
      "Profil public complet (photos, vidéos, bio)",
      "Candidature à toutes les missions ouvertes",
      "Messagerie avec les recruteurs",
      "Badge de vérification disponible",
      "Avis et notation après mission",
      "Notifications email en temps réel",
    ],
  },
  {
    name: "Recruteur Starter",
    price: "Gratuit",
    sub: "1 casting / mois",
    cta: "Démarrer gratuitement",
    href: "/inscription/recruteur",
    primary: false,
    features: [
      "1 mission publiée par mois",
      "Jusqu'à 20 candidatures par mission",
      "Accès au catalogue talents",
      "Messagerie intégrée",
      "Tableau de bord recruteur",
    ],
  },
  {
    name: "Recruteur Pro",
    price: "15 000 XAF",
    sub: "/ mois · sans engagement",
    cta: "Passer en Pro",
    href: "/inscription/recruteur",
    primary: true,
    badge: "Le plus populaire",
    features: [
      "Castings illimités",
      "Candidatures illimitées par mission",
      "Mise en avant en tête de liste",
      "Badge « Recruteur Vérifié »",
      "Filtres avancés sur les talents",
      "Support prioritaire",
      "Statistiques détaillées",
    ],
  },
];

export default function TarifsPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">

        {/* ── Hero header ── */}
        <section
          className="pt-32 pb-20 text-center"
          style={{ background: "#030f0a" }}
        >
          <div className="container-xl max-w-2xl mx-auto">
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">
              Tarifs
            </span>
            <h1
              className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-white mb-5"
              style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}
            >
              Simple,{" "}
              <em style={{ fontStyle: "italic", color: "#26d07c" }}>transparent</em>
            </h1>
            <p
              className="font-body font-300 text-[1.0625rem] leading-[1.75]"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Les talents accèdent à E.Talent gratuitement. Les recruteurs choisissent
              la formule qui correspond à leurs besoins.
            </p>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="section-padding" style={{ background: "#f5f4f0" }}>
          <div className="container-xl">
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {PLANS.map((plan) => (
                <div
                  key={plan.name}
                  className="relative flex flex-col p-8 rounded-2xl bg-white"
                  style={{
                    border: plan.primary ? "2px solid #26d07c" : "1px solid #e8e6df",
                    boxShadow: plan.primary ? "0 20px 60px rgba(38,208,124,0.12)" : "none",
                  }}
                >
                  {plan.badge && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-mono text-[0.5625rem] tracking-[0.12em] uppercase text-ink"
                      style={{ background: "#26d07c" }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <p className="font-mono text-[0.625rem] tracking-[0.18em] uppercase mb-3" style={{ color: "#9a9890" }}>
                      {plan.name}
                    </p>
                    <div className="flex items-end gap-2">
                      <span
                        className="font-heading font-600 leading-none tracking-[-0.02em] text-ink"
                        style={{ fontSize: "clamp(1.75rem,3vw,2.5rem)" }}
                      >
                        {plan.price}
                      </span>
                    </div>
                    <p className="font-body text-sm mt-1" style={{ color: "#9a9890" }}>
                      {plan.sub}
                    </p>
                  </div>

                  <ul className="flex flex-col gap-3 flex-1 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={15} className="shrink-0 mt-0.5" style={{ color: "#1a9958" }} />
                        <span className="font-body text-[0.9rem] leading-[1.6]" style={{ color: "#3a3832" }}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-600 text-[0.875rem] transition-all duration-300"
                    style={
                      plan.primary
                        ? { background: "#26d07c", color: "#030f0a" }
                        : { border: "1px solid #e8e6df", color: "#030f0a" }
                    }
                  >
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>

            {/* FAQ mini */}
            <div className="mt-20 max-w-2xl mx-auto">
              <h2
                className="font-heading font-600 text-ink text-center mb-10 tracking-[-0.01em]"
                style={{ fontSize: "clamp(1.5rem,2.5vw,2.25rem)" }}
              >
                Questions fréquentes
              </h2>
              {[
                {
                  q: "Le passage en Pro est-il sans engagement ?",
                  a: "Oui. Vous pouvez annuler à tout moment depuis votre tableau de bord recruteur, sans frais.",
                },
                {
                  q: "Les paiements de missions sont-ils inclus dans le tarif ?",
                  a: "Non. Les paiements entre recruteurs et talents transitent hors plateforme pour l'instant. Une fonctionnalité de paiement intégré est prévue.",
                },
                {
                  q: "Comment obtenir le badge Talent Vérifié ?",
                  a: "Complétez votre profil à 100 %, soumettez une pièce d'identité et attendez la validation de notre équipe (sous 48h ouvrées).",
                },
              ].map(({ q, a }) => (
                <div
                  key={q}
                  className="py-6"
                  style={{ borderBottom: "1px solid #e8e6df" }}
                >
                  <p className="font-heading font-600 text-ink text-[1.0625rem] mb-2 tracking-[-0.01em]">{q}</p>
                  <p className="font-body font-300 text-[0.9375rem] leading-[1.7]" style={{ color: "#3a3832" }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <FooterSection />
    </>
  );
}