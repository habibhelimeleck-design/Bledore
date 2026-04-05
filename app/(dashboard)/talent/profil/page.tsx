"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Loader2, Camera, Check, Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { GABON_CITIES, TALENT_SKILLS, GABON_LANGUAGES, initials } from "@/lib/utils";
import type { Profile, TalentSocials } from "@/lib/types/database";

const SOCIAL_PLATFORMS: { key: keyof TalentSocials; label: string; placeholder: string; icon: React.ReactNode; followerLabel: string }[] = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/tonprofil", icon: <Instagram size={16} />, followerLabel: "Abonnés" },
  { key: "tiktok",    label: "TikTok",    placeholder: "https://tiktok.com/@tonprofil",  icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/></svg>
    ), followerLabel: "Abonnés" },
  { key: "youtube",   label: "YouTube",   placeholder: "https://youtube.com/@tachaîne",  icon: <Youtube size={16} />,   followerLabel: "Abonnés" },
  { key: "facebook",  label: "Facebook",  placeholder: "https://facebook.com/tapage",    icon: <Facebook size={16} />,  followerLabel: "Abonnés" },
  { key: "twitter",   label: "Twitter / X", placeholder: "https://x.com/tonprofil",     icon: <Twitter size={16} />,   followerLabel: "Abonnés" },
];

export default function FaceProfilPage() {
  const supabase  = createClient();
  const fileRef   = useRef<HTMLInputElement>(null);

  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [form,     setForm]     = useState<Partial<Profile>>({});
  const [socials,  setSocials]  = useState<TalentSocials>({});
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [uploading,setUploading]= useState(false);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setProfile(data);
        setForm(data);
        setSocials((data.socials as TalentSocials | null) ?? {});
      }
      setLoading(false);
    })();
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    setUploading(true);

    const ext  = file.name.split(".").pop();
    const path = `avatars/${profile.id}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("media")
      .upload(path, file, { upsert: true });

    if (!upErr) {
      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", profile.id);
      setForm((f) => ({ ...f, avatar_url: publicUrl }));
      setProfile((p) => p ? { ...p, avatar_url: publicUrl } : p);
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true); setError(null);

    /* Nettoyer les réseaux vides avant sauvegarde */
    const cleanedSocials: TalentSocials = {};
    for (const [key, val] of Object.entries(socials) as [keyof TalentSocials, { url?: string; followers?: number; subscribers?: number }][]) {
      if (val?.url?.trim()) cleanedSocials[key] = val as never;
    }

    const { error: err } = await supabase.from("profiles").update({
      full_name:   form.full_name,
      username:    form.username || null,
      bio:         form.bio || null,
      phone:       form.phone || null,
      city:        form.city || null,
      gender:      form.gender || null,
      height_cm:   form.height_cm || null,
      birth_date:  form.birth_date || null,
      skills:      (form.skills as string[] | null)?.length ? form.skills : null,
      languages:   (form.languages as string[] | null)?.length ? form.languages : null,
      socials:     Object.keys(cleanedSocials).length ? cleanedSocials : null,
      visibility:  form.visibility,
      is_available:form.is_available,
    }).eq("id", profile.id);

    setSaving(false);
    if (err) { setError(err.message); }
    else { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  function toggleArray(field: "skills" | "languages", val: string) {
    const current = (form[field] as string[] | null) ?? [];
    setForm((f) => ({
      ...f,
      [field]: current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
    }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-em-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-8">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Mon compte</p>
        <h1 className="font-heading text-h1 text-ink">Mon profil</h1>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        {/* Avatar */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Photo de profil</h2>
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-em-100 ring-2 ring-em-200">
                {form.avatar_url ? (
                  <Image src={form.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="w-full h-full flex items-center justify-center text-em-700 font-heading text-2xl">
                    {initials(form.full_name ?? "?")}
                  </span>
                )}
              </div>
              <button type="button" onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-em-900 flex items-center justify-center text-white shadow-em-sm hover:bg-em-700 transition-colors">
                {uploading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
              </button>
            </div>
            <div>
              <p className="font-medium text-ink text-sm">{form.full_name}</p>
              <button type="button" onClick={() => fileRef.current?.click()}
                className="text-em-600 text-sm hover:text-em-400 transition-colors mt-1">
                {uploading ? "Téléchargement…" : "Changer la photo"}
              </button>
              <p className="text-sand-400 text-xs mt-0.5">JPG, PNG · Max 5 Mo</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>

        {/* Informations de base */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-5 text-sm uppercase tracking-wider">Informations</h2>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Nom complet *</label>
                <input className="form-input" required
                  value={form.full_name ?? ""} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Nom d'utilisateur</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sand-400 text-sm">@</span>
                  <input className="form-input pl-7"
                    value={form.username ?? ""} onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="amara_gabon" />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Bio / Présentation</label>
              <textarea className="form-input" rows={3}
                placeholder="Parlez de vous, de votre expérience, de vos projets…"
                value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">Téléphone</label>
                <input className="form-input" type="tel" placeholder="+241 XX XX XX XX"
                  value={form.phone ?? ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="form-label">Ville</label>
                <select className="form-input form-select"
                  value={form.city ?? ""} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  <option value="">Choisir…</option>
                  {GABON_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="form-label">Genre</label>
                <select className="form-input form-select"
                  value={form.gender ?? ""} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="">—</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className="form-label">Taille (cm)</label>
                <input className="form-input" type="number" min={140} max={220}
                  value={form.height_cm ?? ""} onChange={(e) => setForm({ ...form, height_cm: Number(e.target.value) || null })} />
              </div>
              <div>
                <label className="form-label">Date de naissance</label>
                <input className="form-input" type="date"
                  value={form.birth_date ?? ""} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        {/* Compétences */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Compétences</h2>
          <div className="flex flex-wrap gap-2">
            {TALENT_SKILLS.map((skill) => {
              const active = ((form.skills as string[] | null) ?? []).includes(skill);
              return (
                <button key={skill} type="button" onClick={() => toggleArray("skills", skill)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${active
                    ? "bg-em-900 text-white border-em-700"
                    : "bg-white text-sand-600 border-[var(--border)] hover:border-em-400"}`}>
                  {skill}
                </button>
              );
            })}
          </div>
        </div>

        {/* Langues */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Langues</h2>
          <div className="flex flex-wrap gap-2">
            {GABON_LANGUAGES.map((lang) => {
              const active = ((form.languages as string[] | null) ?? []).includes(lang);
              return (
                <button key={lang} type="button" onClick={() => toggleArray("languages", lang)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all duration-200 ${active
                    ? "bg-em-900 text-white border-em-700"
                    : "bg-white text-sand-600 border-[var(--border)] hover:border-em-400"}`}>
                  {lang}
                </button>
              );
            })}
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-1 text-sm uppercase tracking-wider">Réseaux sociaux</h2>
          <p className="text-sand-400 text-xs mb-5">Renseigne tes réseaux pour qu'ils apparaissent sur ton profil public.</p>
          <div className="flex flex-col gap-5">
            {SOCIAL_PLATFORMS.map(({ key, label, placeholder, icon, followerLabel }) => {
              const entry = (socials[key] ?? {}) as { url?: string; followers?: number; subscribers?: number };
              const countKey = key === "youtube" ? "subscribers" : "followers";
              return (
                <div key={key}>
                  <label className="form-label flex items-center gap-1.5">
                    <span className="text-sand-400">{icon}</span>
                    {label}
                  </label>
                  <div className="grid grid-cols-[1fr_140px] gap-3">
                    <input
                      className="form-input"
                      type="url"
                      placeholder={placeholder}
                      value={entry.url ?? ""}
                      onChange={(e) =>
                        setSocials((prev) => ({
                          ...prev,
                          [key]: { ...entry, url: e.target.value },
                        }))
                      }
                    />
                    <div className="relative">
                      <input
                        className="form-input pr-2"
                        type="number"
                        min={0}
                        placeholder={followerLabel}
                        value={(entry[countKey as keyof typeof entry] as number | undefined) ?? ""}
                        onChange={(e) =>
                          setSocials((prev) => ({
                            ...prev,
                            [key]: { ...entry, [countKey]: Number(e.target.value) || 0 },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visibilité */}
        <div className="card p-6">
          <h2 className="font-semibold text-ink mb-4 text-sm uppercase tracking-wider">Visibilité</h2>
          <div className="flex flex-col gap-3">
            {([
              { val: "public",          label: "Public",               desc: "Visible par tout le monde" },
              { val: "producers_only",  label: "Recruteurs uniquement",desc: "Visible seulement par les recruteurs connectés" },
              { val: "private",         label: "Privé",                desc: "Non visible dans le catalogue" },
            ] as const).map(({ val, label, desc }) => (
              <label key={val} className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-em-50 transition-colors">
                <input type="radio" name="visibility" value={val}
                  checked={form.visibility === val}
                  onChange={() => setForm({ ...form, visibility: val })}
                  className="accent-em-600" />
                <div>
                  <p className="font-medium text-ink text-sm">{label}</p>
                  <p className="text-sand-400 text-xs">{desc}</p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3 p-3 rounded-xl hover:bg-em-50 transition-colors cursor-pointer"
            onClick={() => setForm({ ...form, is_available: !form.is_available })}>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${form.is_available ? "bg-em-600 border-em-600" : "border-sand-300"}`}>
              {form.is_available && <Check size={12} className="text-white" />}
            </div>
            <div>
              <p className="font-medium text-ink text-sm">Disponible pour des missions</p>
              <p className="text-sand-400 text-xs">Indique aux recruteurs que tu es disponible</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
        )}

        <button type="submit" disabled={saving}
          className="btn btn-em btn-lg disabled:opacity-60 disabled:cursor-not-allowed">
          {saving  && <Loader2 size={17} className="animate-spin" />}
          {saved   && <Check size={17} />}
          {saving ? "Sauvegarde…" : saved ? "Sauvegardé !" : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
