"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Check, Send } from "lucide-react";

interface Props {
  missionId: string;
  isOpen: boolean;
  userRole: string | null;
  alreadyApplied: boolean;
}

export default function ApplyButton({ missionId, isOpen, userRole, alreadyApplied }: Props) {
  const supabase  = createClient();
  const router    = useRouter();
  const [open,    setOpen]    = useState(false);
  const [letter,  setLetter]  = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/connexion"); return; }

    const { error } = await supabase.from("applications").insert({
      mission_id:   missionId,
      face_id:      user.id,
      cover_letter: letter || null,
      status:       "pending",
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
      setLoading(false);
      setOpen(false);
      router.refresh();
    }
  }

  if (!isOpen) {
    return (
      <div className="text-center py-2">
        <p className="text-sand-500 text-sm">Cette mission est fermée aux candidatures.</p>
      </div>
    );
  }

  if (userRole === "producer") {
    return (
      <div className="text-center py-2">
        <p className="text-sand-500 text-sm">Connectez-vous en tant que talent pour postuler.</p>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="flex flex-col gap-2">
        <Link href="/connexion" className="btn btn-em w-full justify-center">Se connecter pour postuler</Link>
        <Link href="/inscription" className="btn btn-outline w-full justify-center">Créer un compte</Link>
      </div>
    );
  }

  if (alreadyApplied || done) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-em-700 bg-em-50 rounded-xl text-sm font-medium">
        <Check size={15} />
        Candidature envoyée !
      </div>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-em w-full justify-center">
        <Send size={15} />
        Postuler à cette mission
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-fade-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h2 className="font-heading text-xl text-ink">Envoyer ma candidature</h2>
              <p className="text-sand-500 text-sm mt-1">Ajoutez un message personnalisé pour vous démarquer.</p>
            </div>
            <form onSubmit={submit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="form-label">Message de motivation <span className="text-sand-400 font-normal">(optionnel)</span></label>
                <textarea
                  className="form-input resize-none"
                  rows={5}
                  placeholder="Présentez-vous et expliquez pourquoi vous êtes le bon profil pour cette mission…"
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="btn btn-ghost">
                  Annuler
                </button>
                <button type="submit" disabled={loading} className="btn btn-em">
                  {loading ? <><Loader2 size={15} className="animate-spin" /> Envoi…</> : <><Send size={15} /> Envoyer</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
