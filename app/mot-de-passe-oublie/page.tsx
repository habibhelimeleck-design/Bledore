"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, ChevronLeft, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);

    const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reinitialisation`,
    });

    setLoading(false);
    if (err) { setError(err.message); }
    else      { setSent(true); }
  }

  return (
    <div className="min-h-screen bg-sand-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Link href="/connexion" className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink mb-6 transition-colors">
          <ChevronLeft size={15} /> Retour à la connexion
        </Link>

        <div className="card p-8">
          <div className="w-12 h-12 rounded-2xl bg-em-100 flex items-center justify-center mb-5">
            <Mail size={22} className="text-em-700" />
          </div>

          <h1 className="font-heading text-2xl text-ink mb-2">Mot de passe oublié</h1>
          <p className="text-sand-500 text-sm mb-6">
            Entrez votre adresse email et nous vous enverrons un lien de réinitialisation.
          </p>

          {sent ? (
            <div className="p-4 rounded-xl bg-em-50 border border-em-200 text-em-800 text-sm">
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="form-label" htmlFor="email">Adresse email</label>
                <input id="email" type="email" required autoComplete="email" className="form-input"
                  placeholder="vous@exemple.ga"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn btn-em btn-lg disabled:opacity-60">
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Envoi…" : "Envoyer le lien"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
