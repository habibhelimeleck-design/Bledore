"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GABON_CITIES, MISSION_CATEGORIES, TALENT_SKILLS } from "@/lib/utils";
import type { Mission } from "@/lib/types/database";

export default function ModifierMissionPage() {
  const params   = useParams();
  const router   = useRouter();
  const supabase = createClient();
  const id       = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [form,    setForm]    = useState<Partial<Mission>>({});

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("missions").select("*").eq("id", id).single();
      if (data) setForm(data);
      setLoading(false);
    })();
  }, [id]);

  function toggleSkill(skill: string) {
    const current = (form.required_skills as string[] | null) ?? [];
    setForm((f) => ({
      ...f,
      required_skills: current.includes(skill) ? current.filter((s) => s !== skill) : [...current, skill],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);

    const { error: err } = await supabase.from("missions").update({
      title:            form.title,
      description:      form.description,
      category:         form.category,
      location:         form.location || null,
      is_remote:        form.is_remote,
      required_gender:  form.required_gender || null,
      required_age_min: form.required_age_min || null,
      required_age_max: form.required_age_max || null,
      required_skills:  (form.required_skills as string[] | null)?.length ? form.required_skills : null,
      budget_min:       form.budget_min || null,
      budget_max:       form.budget_max || null,
      deadline:         form.deadline || null,
      shooting_date:    form.shooting_date || null,
    }).eq("id", id);

    setSaving(false);
    if (err) { setError(err.message); return; }
    router.push(`/producteur/missions/${id}`);
    router.refresh();
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="animate-spin text-em-400" /></div>;
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link href={`/recruteur/missions/${id}`} className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink mb-6 transition-colors">
        <ChevronLeft size={15} /> Retour
      </Link>
      <div className="mb-8">
        <h1 className="font-heading text-h1 text-ink">Modifier la mission</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Informations</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="form-label">Titre *</label>
              <input className="form-input" required
                value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Description *</label>
              <textarea className="form-input" required rows={4}
                value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Catégorie *</label>
                <select className="form-input form-select" required
                  value={form.category ?? ""} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Choisir…</option>
                  {MISSION_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Lieu</label>
                <select className="form-input form-select"
                  value={form.location ?? ""} onChange={(e) => setForm({ ...form, location: e.target.value })}>
                  <option value="">Non précisé</option>
                  {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.is_remote ?? false}
                onChange={(e) => setForm({ ...form, is_remote: e.target.checked })}
                className="w-4 h-4 rounded accent-em-600" />
              <span className="text-sm text-sand-700">Mission possible à distance</span>
            </label>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Critères</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">Genre</label>
                <select className="form-input form-select"
                  value={form.required_gender ?? ""} onChange={(e) => setForm({ ...form, required_gender: e.target.value })}>
                  <option value="">Peu importe</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="mixte">Mixte</option>
                </select>
              </div>
              <div>
                <label className="form-label">Âge min</label>
                <input className="form-input" type="number" min={16} max={80}
                  value={form.required_age_min ?? ""} onChange={(e) => setForm({ ...form, required_age_min: Number(e.target.value) || null })} />
              </div>
              <div>
                <label className="form-label">Âge max</label>
                <input className="form-input" type="number" min={16} max={80}
                  value={form.required_age_max ?? ""} onChange={(e) => setForm({ ...form, required_age_max: Number(e.target.value) || null })} />
              </div>
            </div>
            <div>
              <label className="form-label">Compétences</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {TALENT_SKILLS.map((skill) => {
                  const active = ((form.required_skills as string[] | null) ?? []).includes(skill);
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

        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Budget & Dates</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Budget min (XAF)</label>
              <input className="form-input" type="number" min={0}
                value={form.budget_min ?? ""} onChange={(e) => setForm({ ...form, budget_min: Number(e.target.value) || null })} />
            </div>
            <div>
              <label className="form-label">Budget max (XAF)</label>
              <input className="form-input" type="number" min={0}
                value={form.budget_max ?? ""} onChange={(e) => setForm({ ...form, budget_max: Number(e.target.value) || null })} />
            </div>
            <div>
              <label className="form-label">Deadline candidature</label>
              <input className="form-input" type="date"
                value={form.deadline ?? ""} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="form-label">Date tournage</label>
              <input className="form-input" type="date"
                value={form.shooting_date ?? ""} onChange={(e) => setForm({ ...form, shooting_date: e.target.value })} />
            </div>
          </div>
        </div>

        {error && <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}

        <button type="submit" disabled={saving} className="btn btn-em btn-lg disabled:opacity-60">
          {saving && <Loader2 size={17} className="animate-spin" />}
          {saving ? "Enregistrement…" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
