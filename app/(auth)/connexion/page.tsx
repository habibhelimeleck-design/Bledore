"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: form.email.trim(),
      password: form.password,
    });

    if (authError) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // Get role to redirect to correct dashboard
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    router.push(profile?.role === "producer" ? "/recruteur" : "/talent");
    router.refresh();
  }

  return (
    <div className="animate-fade-in">
      <h1 className="font-heading text-h1 text-ink mb-1">Bon retour.</h1>
      <p className="text-sand-500 text-body-sm mb-8">
        Connectez-vous à votre compte E.Talent.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="form-label" htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            className={`form-input ${error ? "form-input-error" : ""}`}
            placeholder="vous@exemple.ga"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <label className="form-label mb-0" htmlFor="password">Mot de passe</label>
            <Link href="/mot-de-passe-oublie" className="text-xs text-em-600 hover:text-em-400 transition-colors">
              Oublié ?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPwd ? "text" : "password"}
              autoComplete="current-password"
              required
              className={`form-input pr-11 ${error ? "form-input-error" : ""}`}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-400 hover:text-sand-700 transition-colors"
              aria-label={showPwd ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {error && <p className="form-error">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-em btn-lg mt-1 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 size={17} className="animate-spin" />}
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--border)]">
        <p className="text-center text-sm text-sand-500">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-em-600 font-semibold hover:text-em-400 transition-colors">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
