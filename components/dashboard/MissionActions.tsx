"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Globe, EyeOff, Loader2, MoreVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { MissionStatus } from "@/lib/types/database";

interface Props {
  missionId: string;
  status: MissionStatus;
}

export default function MissionActions({ missionId, status }: Props) {
  const supabase = createClient();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);
  const [open,    setOpen]    = useState(false);

  async function updateStatus(newStatus: MissionStatus) {
    setLoading(true); setOpen(false);
    await supabase.from("missions").update({ status: newStatus }).eq("id", missionId);
    setLoading(false);
    router.refresh();
  }

  async function deleteMission() {
    if (!confirm("Supprimer cette mission définitivement ?")) return;
    setLoading(true); setOpen(false);
    await supabase.from("missions").delete().eq("id", missionId);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} disabled={loading}
        className="btn btn-ghost btn-sm p-2.5"
        aria-label="Actions">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <MoreVertical size={15} />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-medium border border-[var(--border)] py-1 w-44 animate-scale-in">
            {status === "draft" && (
              <button onClick={() => updateStatus("published")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-em-700 hover:bg-em-50 transition-colors">
                <Globe size={14} /> Publier
              </button>
            )}
            {status === "published" && (
              <button onClick={() => updateStatus("closed")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-sand-700 hover:bg-sand-50 transition-colors">
                <EyeOff size={14} /> Fermer
              </button>
            )}
            {status === "closed" && (
              <button onClick={() => updateStatus("published")}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-em-700 hover:bg-em-50 transition-colors">
                <Globe size={14} /> Republier
              </button>
            )}
            <hr className="my-1 border-[var(--border)]" />
            <button onClick={deleteMission}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
              <Trash2 size={14} /> Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
}
