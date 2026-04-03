"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GABON_CITIES, MISSION_CATEGORIES, TALENT_SKILLS } from "@/lib/utils";

export default function NouvelleMissionPage() {
  const supabase = createClient();
  const router   = useRouter();

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [form, setForm] = useState({
    title:            "",
    description:      "",
    category:         "",
    location:         "",
    is_remote:        false,
    required_gender:  "",
    required_age_min: "",
    required_age_max: "",
    required_skills:  [] as string[],
    budget_min:       "",
    budget_max:       "",
    is_paid:          true,
    deadline:         "",
    shooting_date:    "",
    status:           "draft" as "draft" | "published",
  });

  function toggleSkill(skill: string) {
    setForm((prev) => ({
      ...prev,
      required_skills: prev.required_skills.includes(skill)
        ? prev.required_skills.filter((s) => s !== skill)
        : [...prev.required_skills, skill],
    }));
  }

  async function handleSubmit(e: React.FormEvent, saveAsDraft = false) {
    e.preventDefault();
    setError(null); setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Non connecté."); setLoading(false); return; }

    const { data, error: err } = await supabase.from("missions").insert({
      producer_id:      user.id,
      title:            form.title.trim(),
      description:      form.description.trim(),
      category:         form.category,
      location:         form.location || null,
      is_remote:        form.is_remote,
      required_gender:  form.required_gender || null,
      required_age_min: form.required_age_min ? Number(form.required_age_min) : null,
      required_age_max: form.required_age_max ? Number(form.required_age_max) : null,
      required_skills:  form.required_skills.length ? form.required_skills : null,
      budget_min:       form.budget_min ? Number(form.budget_min) : null,
      budget_max:       form.budget_max ? Number(form.budget_max) : null,
      currency:         "XAF",
      deadline:         form.deadline || null,
      shooting_date:    form.shooting_date || null,
      status:           saveAsDraft ? "draft" : form.status,
    }).select().single();

    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push(`/recruteur/missions/${data.id}`);
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link href="/recruteur/missions" className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink mb-6 transition-colors">
        <ChevronLeft size={15} /> Retour aux missions
      </Link>

      <div className="mb-8">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Recrutement</p>
        <h1 className="font-heading text-h1 text-ink">Nouvelle mission</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Infos de base */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Informations</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="form-label">Titre de la mission *</label>
              <input className="form-input" required
                placeholder="ex : Recherche acteur publicité Moov Africa"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Description *</label>
              <textarea className="form-input" required rows={4}
                placeholder="Décrivez la mission, le projet, ce que vous attendez du talent…"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Catégorie *</label>
                <select className="form-input form-select" required
                  value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Choisir…</option>
                  {MISSION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lieu</label>
                <select className="form-input form-select"
                  value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                  <option value="">Non précisé</option>
                  {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.is_remote} onChange={(e) => setForm({ ...form, is_remote: e.target.checked })}
                className="w-4 h-4 rounded accent-em-600" />
              <span className="text-sm text-sand-700">Mission possible à distance</span>
            </label>
          </div>
        </div>

        {/* Critères */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Critères de casting</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">Genre</label>
                <select className="form-input form-select"
                  value={form.required_gender} onChange={(e) => setForm({ ...form, required_gender: e.target.value })}>
                  <option value="">Peu importe</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="mixte">Mixte</option>
                </select>
              </div>
              <div>
                <label className="form-label">Âge min</label>
                <input className="form-input" type="number" min={16} max={80}
                  placeholder="—"
                  value={form.required_age_min} onChange={(e) => setForm({ ...form, required_age_min: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Âge max</label>
                <input className="form-input" type="number" min={16} max={80}
                  placeholder="—"
                  value={form.required_age_max} onChange={(e) => setForm({ ...form, required_age_max: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="form-label">Compétences requises</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {TALENT_SKILLS.map((skill) => {
                  const active = form.required_skills.includes(skill);
                  return (
                    <button key={skill} type="button" onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${active
                        ? "bg-em-900 text-white border-em-700"
                        : "bg-white text-sand-600 border-[var(--border)] hover:border-em-400"}`}>
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Rémunération */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Rémunération</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Budget minimum (XAF)</label>
                <input className="form-input" type="number" min={0} placeholder="ex : 50000"
                  value={form.budget_min} onChange={(e) => setForm({ ...form, budget_min: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Budget maximum (XAF)</label>
                <input className="form-input" type="number" min={0} placeholder="ex : 200000"
                  value={form.budget_max} onChange={(e) => setForm({ ...form, budget_max: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={!form.is_paid} onChange={(e) => setForm({ ...form, is_paid: !e.target.checked })}
                className="w-4 h-4 rounded accent-em-600" />
              <span className="text-sm text-sand-700">Mission non rémunérée (bénévolat, exposition)</span>
            </label>
          </div>
        </div>

        {/* Dates */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Date limite de candidature</label>
              <input className="form-input" type="date"
                value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Date de tournage / événement</label>
              <input className="form-input" type="date"
                value={form.shooting_date} onChange={(e) => setForm({ ...form, shooting_date: e.target.value })} />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <div className="flex gap-3">
          <button type="button" disabled={loading}
            onClick={(e) => handleSubmit(e as any, true)}
            className="btn btn-ghost flex-1 disabled:opacity-60">
            Enregistrer comme brouillon
          </button>
          <button type="submit" disabled={loading || !form.title || !form.description || !form.category}
            onClick={(e) => { setForm((f) => ({ ...f, status: "published" })); }}
            className="btn btn-em flex-[2] disabled:opacity-60 disabled:cursor-not-allowed">
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Publication…" : "Publier la mission"}
          </button>
        </div>
      </form>
    </div>
  );
}
