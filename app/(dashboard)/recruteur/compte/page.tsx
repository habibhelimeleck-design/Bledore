"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { GABON_CITIES } from "@/lib/utils";
import { Check, Loader2, Building2, User } from "lucide-react";

type Tab = "profil" | "entreprise";

export default function ProducteurComptePage() {
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("profil");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error,   setError]   = useState<string | null>(null);

  const [profile, setProfile] = useState({
    full_name: "", phone: "", city: "", bio: "",
  });
  const [company, setCompany] = useState({
    company_name: "", sector: "", website: "", description: "",
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) setProfile({ full_name: p.full_name ?? "", phone: p.phone ?? "", city: p.city ?? "", bio: p.bio ?? "" });

      const { data: c } = await supabase.from("producer_accounts").select("*").eq("profile_id", user.id).single();
      if (c) setCompany({ company_name: c.company_name ?? "", sector: c.sector ?? "", website: c.website ?? "", description: c.description ?? "" });

      setLoading(false);
    }
    load();
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true); setError(null); setSuccess(null);
    try {
      const { error } = await supabase.from("profiles").update({
        full_name: profile.full_name,
        phone:     profile.phone || null,
        city:      profile.city || null,
        bio:       profile.bio || null,
      }).eq("id", userId);
      if (error) throw error;
      setSuccess("Profil mis à jour.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveCompany(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;
    setSaving(true); setError(null); setSuccess(null);
    try {
      // Upsert producer_accounts
      const { error } = await supabase.from("producer_accounts").upsert({
        profile_id:   userId,
        company_name: company.company_name,
        sector:       company.sector || null,
        website:      company.website || null,
        description:  company.description || null,
      }, { onConflict: "profile_id" });
      if (error) throw error;
      setSuccess("Informations entreprise mises à jour.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={24} className="animate-spin text-em-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Paramètres</p>
        <h1 className="font-heading text-h1 text-ink">Mon compte</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sand-100 rounded-xl p-1 mb-8">
        {([["profil", User, "Mon profil"], ["entreprise", Building2, "Entreprise"]] as const).map(
          ([key, Icon, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSuccess(null); setError(null); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === key ? "bg-white text-ink shadow-sm" : "text-sand-500 hover:text-sand-700"
              }`}>
              <Icon size={15} />
              {label}
            </button>
          )
        )}
      </div>

      {/* Feedback */}
      {success && (
        <div className="mb-4 flex items-center gap-2 text-sm text-em-700 bg-em-50 border border-em-200 rounded-xl px-4 py-3">
          <Check size={15} className="flex-shrink-0" />
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Profil form */}
      {tab === "profil" && (
        <form onSubmit={saveProfile} className="card p-6 flex flex-col gap-5">
          <div>
            <label className="form-label">Nom complet *</label>
            <input className="form-input" required value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Téléphone</label>
            <input className="form-input" type="tel" placeholder="+241 01 23 45 67"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Ville</label>
            <select className="form-input form-select" value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}>
              <option value="">Sélectionner</option>
              {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="form-label">Bio / Présentation</label>
            <textarea className="form-input resize-none" rows={3} placeholder="Décrivez votre activité…"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn btn-em self-end">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : "Enregistrer"}
          </button>
        </form>
      )}

      {/* Entreprise form */}
      {tab === "entreprise" && (
        <form onSubmit={saveCompany} className="card p-6 flex flex-col gap-5">
          <div>
            <label className="form-label">Nom de l'entreprise *</label>
            <input className="form-input" required value={company.company_name}
              onChange={(e) => setCompany({ ...company, company_name: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Secteur d'activité</label>
            <select className="form-input form-select" value={company.sector}
              onChange={(e) => setCompany({ ...company, sector: e.target.value })}>
              <option value="">Sélectionner</option>
              {["Médias / Télévision", "Publicité", "Musique", "Cinéma / Série", "Mode / Beauté",
                "Événementiel", "Sport", "ONG / Association", "Autre"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Site web</label>
            <input className="form-input" type="url" placeholder="https://monentreprise.ga"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })} />
          </div>
          <div>
            <label className="form-label">Description de l'entreprise</label>
            <textarea className="form-input resize-none" rows={4}
              placeholder="Présentez votre entreprise aux talents…"
              value={company.description}
              onChange={(e) => setCompany({ ...company, description: e.target.value })} />
          </div>
          <button type="submit" disabled={saving} className="btn btn-em self-end">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Enregistrement…</> : "Enregistrer"}
          </button>
        </form>
      )}
    </div>
  );
}
