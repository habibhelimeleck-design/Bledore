"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Loader2, Upload, Trash2, Star, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MediaAsset } from "@/lib/types/database";

export default function FaceGaleriePage() {
  const supabase  = createClient();
  const fileRef   = useRef<HTMLInputElement>(null);

  const [userId,    setUserId]    = useState<string | null>(null);
  const [media,     setMedia]     = useState<MediaAsset[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase.from("media_assets")
        .select("*").eq("talent_id", user.id).order("sort_order").order("created_at");
      setMedia(data ?? []);
      setLoading(false);
    })();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length || !userId) return;
    setUploading(true); setError(null);

    for (const file of files) {
      const ext  = file.name.split(".").pop();
      const path = `gallery/${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("media")
        .upload(path, file, { upsert: false });

      if (upErr) { setError(upErr.message); continue; }

      const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(path);
      const isVideo = file.type.startsWith("video/");

      const { data: asset } = await supabase.from("media_assets").insert({
        talent_id:    userId,
        media_type: isVideo ? "video" : "photo",
        url:        publicUrl,
        is_cover:   media.length === 0, // first one = cover
        sort_order: media.length,
      }).select().single();

      if (asset) setMedia((prev) => [...prev, asset]);
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function setCover(id: string) {
    if (!userId) return;
    // Remove cover from all
    await supabase.from("media_assets").update({ is_cover: false }).eq("talent_id", userId);
    // Set new cover
    await supabase.from("media_assets").update({ is_cover: true }).eq("id", id);
    setMedia((prev) => prev.map((m) => ({ ...m, is_cover: m.id === id })));
  }

  async function deleteMedia(asset: MediaAsset) {
    if (!confirm("Supprimer ce média ?")) return;
    // Remove from storage
    const storageKey = asset.url.split("/media/")[1];
    if (storageKey) await supabase.storage.from("media").remove([storageKey]);
    // Remove from DB
    await supabase.from("media_assets").delete().eq("id", asset.id);
    setMedia((prev) => prev.filter((m) => m.id !== asset.id));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-em-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Mon compte</p>
          <h1 className="font-heading text-h1 text-ink">Ma galerie</h1>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="btn btn-em disabled:opacity-60">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? "Téléchargement…" : "Ajouter des photos"}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>
      )}

      {/* Info */}
      <div className="p-4 rounded-xl bg-em-50 border border-em-100 mb-6">
        <p className="text-em-700 text-sm">
          <span className="font-semibold">💡 Conseil :</span> La photo marquée
          <Star size={12} className="inline mx-1 text-gold-DEFAULT" />
          est votre photo de couverture, visible en premier dans le catalogue.
        </p>
      </div>

      {media.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-em-100 flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-em-600" />
          </div>
          <p className="font-heading text-xl text-ink mb-2">Votre galerie est vide</p>
          <p className="text-sand-500 text-sm mb-6">
            Ajoutez des photos et vidéos pour augmenter vos chances d'être sélectionné.
          </p>
          <button onClick={() => fileRef.current?.click()} className="btn btn-em">
            <Upload size={16} /> Ajouter des médias
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {media.map((asset) => (
            <div key={asset.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-sand-100">
              {asset.media_type === "photo" ? (
                <Image src={asset.url} alt={asset.caption ?? "Media"} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <video src={asset.url} className="w-full h-full object-cover" muted />
              )}

              {/* Overlay actions */}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors duration-200 flex items-start justify-between p-2">
                {/* Cover badge */}
                {asset.is_cover && (
                  <span className="badge badge-gold text-xs flex items-center gap-1">
                    <Star size={10} className="fill-gold-DEFAULT" /> Couverture
                  </span>
                )}
                {!asset.is_cover && (
                  <button onClick={() => setCover(asset.id)}
                    title="Définir comme couverture"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-white/90 text-sand-700 hover:bg-white transition-all">
                    <Star size={14} />
                  </button>
                )}
                <button onClick={() => deleteMedia(asset)}
                  title="Supprimer"
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Add more */}
          <button onClick={() => fileRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-[var(--border)] flex flex-col items-center justify-center gap-2 text-sand-400 hover:border-em-400 hover:text-em-600 hover:bg-em-50 transition-all">
            <Plus size={24} />
            <span className="text-sm font-medium">Ajouter</span>
          </button>
        </div>
      )}
    </div>
  );
}
