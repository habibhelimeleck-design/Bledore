import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — form ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-12 xl:px-20 bg-[var(--background)]">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group">
            <div className="w-10 h-10 rounded-xl bg-em-900 flex items-center justify-center group-hover:bg-em-700 transition-colors">
              <span className="font-heading font-semibold text-white text-base tracking-tight">E</span>
            </div>
            <span className="font-heading text-2xl font-semibold text-ink tracking-tight">
              E.<span className="text-em-500">Talent</span>
            </span>
          </Link>

          {children}
        </div>
      </div>

      {/* ── Right panel — visual ──────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative overflow-hidden">
        <div className="absolute inset-0 bg-em-gradient" />
        {/* Overlay pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />
        {/* Floating cards */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 gap-6 w-full">
          <div className="mb-4">
            <p className="font-mono text-em-300 text-xs tracking-widest uppercase mb-3">Gabon · Libreville</p>
            <h2 className="font-heading text-white text-display-lg leading-tight">
              Les meilleurs<br />
              <span className="italic text-em-300">talents</span> du Gabon<br />
              en un seul endroit.
            </h2>
          </div>

          {/* Talent cards */}
          <div className="flex flex-col gap-4 mt-4">
            {[
              { img: "/1.jpg", name: "Mathias Asseko", role: "Entrepreneur Digital", city: "Libreville" },
              { img: "/2.jpg", name: "Jardelle Oniane", role: "Influenceuse · Créatrice de contenu", city: "Port-Gentil" },
              { img: "/3.jpg", name: "Nephtalie Nalick", role: "Influenceur · Créateur de contenu", city: "Libreville" },
            ].map((t) => (
              <div key={t.name} className="card-dark flex items-center gap-3 px-4 py-3 animate-fade-up">
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-em-400/30">
                  <Image src={t.img} alt={t.name} fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{t.name}</p>
                  <p className="text-em-300 text-xs truncate">{t.role}</p>
                </div>
                <span className="ml-auto badge badge-dark text-xs flex-shrink-0">{t.city}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-2 pt-6 border-t border-white/10">
            {[
              { n: "500+", label: "Talents" },
              { n: "120+", label: "Missions" },
              { n: "80+",  label: "Recruteurs" },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <p className="font-heading text-white text-2xl font-semibold">{n}</p>
                <p className="text-em-300 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
