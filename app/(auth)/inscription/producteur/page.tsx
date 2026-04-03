"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GABON_CITIES } from "@/lib/utils";

const SECTORS = [
  "Publicité / Communication",
  "Cinéma / Production audiovisuelle",
  "Musique / Événementiel",
  "Mode / Beauté",
  "Médias / Presse",
  "ONG / Association",
  "Entreprise (autre)",
];

export default function InscriptionProducteurPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name:    "",
    email:        "",
    password:     "",
    company_name: "",
    sector:       "",
    city:         "",
    website:      "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        data: {
          full_name: form.full_name.trim(),
          role: "producer",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    // Update profile city
    await supabase.from("profiles").update({ city: form.city || null }).eq("id", user.id);

    // Create producer account
    const { error: accountError } = await supabase.from("producer_accounts").insert({
      profile_id:   user.id,
      company_name: form.company_name.trim(),
      sector:       form.sector || null,
      website:      form.website.trim() || null,
    });

    if (accountError) {
      setError("Impossible de créer votre compte entreprise. Veuillez réessayer.");
      setLoading(false);
      return;
    }

    router.push("/producteur");
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <Link href="/inscription" className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink mb-6 transition-colors">
        <ChevronLeft size={15} />
        Retour
      </Link>

      <h1 className="font-heading text-h1 text-ink mb-1">Compte recruteur</h1>
      <p className="text-sand-500 text-sm mb-8">
        Étape {step} sur 2 — {step === 1 ? "Votre compte" : "Votre entreprise"}
      </p>

      <div className="flex gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-gold-DEFAULT" : "bg-[var(--muted)]"}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div>
              <label className="form-label" htmlFor="full_name">Votre nom *</label>
              <input id="full_name" type="text" required className="form-input"
                placeholder="Jean-Baptiste Ondo"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="email">Email professionnel *</label>
              <input id="email" type="email" required autoComplete="email" className="form-input"
                placeholder="contact@agence.ga"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">Mot de passe *</label>
              <div className="relative">
                <input id="password" type={showPwd ? "text" : "password"} required
                  className="form-input pr-11" minLength={8}
                  placeholder="Minimum 8 caractères"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700 transition-colors"
                  aria-label={showPwd ? "Masquer" : "Afficher"}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="button" onClick={() => setStep(2)}
              disabled={!form.full_name || !form.email || form.password.length < 8}
              className="btn btn-gold btn-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              Continuer
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div>
              <label className="form-label" htmlFor="company_name">Nom de la structure / entreprise *</label>
              <input id="company_name" type="text" required className="form-input"
                placeholder="Agence Léo Productions"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="sector">Secteur</label>
                <select id="sector" className="form-input form-select"
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}>
                  <option value="">Choisir…</option>
                  {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="city">Ville</label>
                <select id="city" className="form-input form-select"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  <option value="">Choisir…</option>
                  {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" htmlFor="website">Site web (optionnel)</label>
              <input id="website" type="url" className="form-input"
                placeholder="https://votre-site.ga"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)} className="btn btn-ghost flex-1">Retour</button>
              <button type="submit" disabled={loading || !form.company_name}
                className="btn btn-gold flex-[2] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Création…" : "Créer mon compte"}
              </button>
            </div>
          </div>
        )}
      </form>

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
