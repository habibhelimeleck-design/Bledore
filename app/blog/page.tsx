import type { Metadata } from "next";
import Link from "next/link";
import NavBar from "@/components/home/NavBar";
import FooterSection from "@/components/home/FooterSection";
import { ArrowRight, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conseils, actualités et tendances du casting et de la création de contenu au Gabon.",
};

const ARTICLES = [
  {
    category: "Conseils talents",
    title: "Comment créer un profil qui attire les recruteurs dès la première visite",
    excerpt:
      "Photo de qualité, bio percutante, spécialités bien renseignées… Les recruteurs parcourent des dizaines de profils. Voici comment sortir du lot.",
    readTime: "5 min",
    date: "Mars 2026",
    slug: "#",
    featured: true,
  },
  {
    category: "Tendances",
    title: "Le marché du casting digital au Gabon : état des lieux 2026",
    excerpt:
      "Entre réseaux sociaux, clips musicaux et publicités digitales, les opportunités pour les talents gabonais n'ont jamais été aussi nombreuses.",
    readTime: "8 min",
    date: "Février 2026",
    slug: "#",
    featured: false,
  },
  {
    category: "Conseils recruteurs",
    title: "Rédiger une brief de casting convaincante : les 5 erreurs à éviter",
    excerpt:
      "Un brief flou décourage les meilleurs talents. Apprenez à décrire votre mission avec précision pour recevoir des candidatures de qualité.",
    readTime: "4 min",
    date: "Janvier 2026",
    slug: "#",
    featured: false,
  },
  {
    category: "Success story",
    title: "Gérard Bourobou : comment il a casté son clip en 48h grâce à E.Talent",
    excerpt:
      "L'entrepreneur digital partage son expérience et ses conseils pour un processus de casting rapide et efficace.",
    readTime: "6 min",
    date: "Décembre 2025",
    slug: "#",
    featured: false,
  },
];

export default function BlogPage() {
  return (
    <>
      <NavBar />
      <main id="main-content">

        {/* ── Hero ── */}
        <section className="pt-32 pb-20" style={{ background: "#030f0a" }}>
          <div className="container-xl">
            <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-6 block">
              Blog E.Talent
            </span>
            <h1
              className="font-heading font-600 leading-[1.0] tracking-[-0.02em] text-white"
              style={{ fontSize: "clamp(2.5rem,5vw,4.5rem)" }}
            >
              Actualités &{" "}
              <em style={{ fontStyle: "italic", color: "#26d07c" }}>conseils</em>
            </h1>
            <p
              className="font-body font-300 text-[1.0625rem] leading-[1.75] mt-5 max-w-xl"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Ressources, tendances et témoignages pour les talents et recruteurs
              du Gabon et d'Afrique Centrale.
            </p>
          </div>
        </section>

        {/* ── Articles ── */}
        <section className="section-padding" style={{ background: "#f5f4f0" }}>
          <div className="container-xl">

            {/* Featured article */}
            {ARTICLES.filter((a) => a.featured).map((a) => (
              <Link
                key={a.title}
                href={a.slug}
                className="group flex flex-col lg:flex-row gap-8 p-8 rounded-2xl bg-white mb-8 hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_20px_60px_rgba(3,15,10,0.08)]"
                style={{ border: "1px solid #e8e6df" }}
              >
                <div
                  className="lg:w-1/3 rounded-xl aspect-video lg:aspect-auto"
                  style={{ background: "linear-gradient(135deg, #063d1e 0%, #0d6637 100%)" }}
                  aria-hidden="true"
                />
                <div className="flex flex-col justify-center gap-4 flex-1">
                  <span
                    className="font-mono text-[0.5625rem] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full w-fit"
                    style={{ background: "#eefbf4", color: "#0d6637", border: "1px solid #b8f4d6" }}
                  >
                    {a.category}
                  </span>
                  <h2 className="font-heading font-600 text-ink leading-[1.2] tracking-[-0.01em] group-hover:text-em-700 transition-colors duration-200" style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)" }}>
                    {a.title}
                  </h2>
                  <p className="font-body font-300 text-[0.9375rem] leading-[1.7]" style={{ color: "#3a3832" }}>
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5" style={{ color: "#9a9890" }}>
                      <Clock size={13} aria-hidden="true" />
                      <span className="font-mono text-xs">{a.readTime} de lecture</span>
                    </div>
                    <span className="font-mono text-xs" style={{ color: "#9a9890" }}>{a.date}</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Other articles */}
            <div className="grid sm:grid-cols-3 gap-6">
              {ARTICLES.filter((a) => !a.featured).map((a) => (
                <Link
                  key={a.title}
                  href={a.slug}
                  className="group flex flex-col gap-5 p-6 rounded-2xl bg-white hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_16px_48px_rgba(3,15,10,0.07)]"
                  style={{ border: "1px solid #e8e6df" }}
                >
                  <div
                    className="rounded-xl aspect-video"
                    style={{ background: "linear-gradient(135deg, #071a10 0%, #0d6637 100%)" }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-mono text-[0.5625rem] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full w-fit"
                    style={{ background: "#f5f4f0", color: "#9a9890" }}
                  >
                    {a.category}
                  </span>
                  <h3 className="font-heading font-600 text-ink leading-[1.3] tracking-[-0.01em] text-[1.0625rem] group-hover:text-em-700 transition-colors duration-200">
                    {a.title}
                  </h3>
                  <p className="font-body font-300 text-[0.875rem] leading-[1.65]" style={{ color: "#3a3832" }}>
                    {a.excerpt}
                  </p>
                  <div className="flex items-center gap-3 mt-auto pt-4" style={{ borderTop: "1px solid #e8e6df" }}>
                    <span className="font-mono text-[0.6875rem]" style={{ color: "#9a9890" }}>{a.readTime} de lecture</span>
                    <span className="font-mono text-[0.6875rem] ml-auto" style={{ color: "#9a9890" }}>{a.date}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Newsletter CTA */}
            <div
              className="mt-16 p-10 rounded-2xl text-center"
              style={{ background: "#030f0a" }}
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] uppercase text-em-500 mb-4 block">
                Newsletter
              </span>
              <h2
                className="font-heading font-600 text-white mb-3 tracking-[-0.01em]"
                style={{ fontSize: "clamp(1.5rem,2.5vw,2rem)" }}
              >
                Restez informé
              </h2>
              <p className="font-body font-300 mb-6" style={{ color: "rgba(255,255,255,0.5)" }}>
                Recevez chaque mois les meilleures opportunités et conseils directement dans votre boîte mail.
              </p>
              <Link
                href="/inscription/talent"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-600 text-[0.875rem] transition-all duration-300"
                style={{ background: "#26d07c", color: "#030f0a" }}
              >
                Rejoindre E.Talent
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <FooterSection />
    </>
  );
}