import Link from "next/link";
import { Users, Briefcase, ArrowRight } from "lucide-react";

export default function InscriptionPage() {
  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-h1 text-ink mb-2">Rejoindre E.Talent</h1>
      <p className="text-sand-500 text-body-sm mb-10">
        Choisissez votre profil pour commencer.
      </p>

      <div className="flex flex-col gap-4">
        {/* Talent */}
        <Link
          href="/inscription/face"
          className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-[var(--border)] hover:border-em-400 hover:bg-em-50 transition-all duration-250"
        >
          <div className="w-12 h-12 rounded-xl bg-em-100 flex items-center justify-center flex-shrink-0 group-hover:bg-em-200 transition-colors">
            <Users size={22} className="text-em-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink text-base">Je suis un talent</p>
            <p className="text-sand-500 text-sm mt-0.5">
              Acteur, mannequin, influenceur, danseur…
            </p>
          </div>
          <ArrowRight size={18} className="text-sand-300 group-hover:text-em-500 group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Recruteur */}
        <Link
          href="/inscription/producteur"
          className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-[var(--border)] hover:border-gold-DEFAULT hover:bg-[rgba(212,168,67,0.05)] transition-all duration-250"
        >
          <div className="w-12 h-12 rounded-xl bg-gold-muted flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(212,168,67,0.2)] transition-colors">
            <Briefcase size={22} className="text-gold-dark" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink text-base">Je suis recruteur</p>
            <p className="text-sand-500 text-sm mt-0.5">
              Agence, maison de production, marque, événementiel…
            </p>
          </div>
          <ArrowRight size={18} className="text-sand-300 group-hover:text-gold-DEFAULT group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <p className="text-center text-sm text-sand-500">
          Déjà membre ?{" "}
          <Link href="/connexion" className="text-em-600 font-semibold hover:text-em-400 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
