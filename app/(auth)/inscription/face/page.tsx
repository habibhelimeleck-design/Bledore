"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GABON_CITIES, TALENT_SKILLS } from "@/lib/utils";

export default function InscriptionFacePage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState<1 | 2>(1);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    city: "",
    gender: "",
    skills: [] as string[],
  });

  function toggleSkill(skill: string) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  }

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
          role: "face",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Update profile with extra fields
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        city:   form.city || null,
        gender: form.gender || null,
        skills: form.skills.length ? form.skills : null,
      }).eq("id", user.id);
    }

    router.push("/face");
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <Link href="/inscription" className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink mb-6 transition-colors">
        <ChevronLeft size={15} />
        Retour
      </Link>

      <h1 className="font-heading text-h1 text-ink mb-1">Créer mon profil talent</h1>
      <p className="text-sand-500 text-sm mb-8">
        Étape {step} sur 2 — {step === 1 ? "Informations de base" : "Ton profil"}
      </p>

      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${s <= step ? "bg-em-400" : "bg-[var(--muted)]"}`} />
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div>
              <label className="form-label" htmlFor="full_name">Nom complet *</label>
              <input id="full_name" type="text" required className="form-input"
                placeholder="Amara Diallo"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="email">Adresse email *</label>
              <input id="email" type="email" required autoComplete="email" className="form-input"
                placeholder="vous@exemple.ga"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">Mot de passe *</label>
              <div className="relative">
                <input id="password" type={showPwd ? "text" : "password"} required
                  className="form-input pr-11"
                  minLength={8}
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
              <p className="form-helper">Au moins 8 caractères.</p>
            </div>

            <button type="button" onClick={() => setStep(2)}
              disabled={!form.full_name || !form.email || form.password.length < 8}
              className="btn btn-em btn-lg mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
              Continuer
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label" htmlFor="city">Ville</label>
                <select id="city" className="form-input form-select"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  <option value="">Choisir…</option>
                  {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" htmlFor="gender">Genre</label>
                <select id="gender" className="form-input form-select"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">Choisir…</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Compétences (optionnel)</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {TALENT_SKILLS.map((skill) => (
                  <button key={skill} type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${
                      form.skills.includes(skill)
                        ? "bg-em-900 text-white border-em-700"
                        : "bg-white text-sand-600 border-[var(--border)] hover:border-em-400"
                    }`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
            )}

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)}
                className="btn btn-ghost flex-1">
                Retour
              </button>
              <button type="submit" disabled={loading}
                className="btn btn-em flex-[2] disabled:opacity-60 disabled:cursor-not-allowed">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Création…" : "Créer mon compte"}
              </button>
            </div>

            <p className="text-xs text-sand-400 text-center">
              En créant un compte, vous acceptez nos{" "}
              <Link href="/cgu" className="underline hover:text-ink">CGU</Link>.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
