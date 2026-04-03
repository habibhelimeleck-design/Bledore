"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_BADGE } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types/database";

const STATUSES: ApplicationStatus[] = ["pending", "viewed", "shortlisted", "accepted", "rejected"];

interface Props {
  appId:         string;
  currentStatus: ApplicationStatus;
}

export default function ApplicationStatusSelector({ appId, currentStatus }: Props) {
  const supabase = createClient();
  const router   = useRouter();
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState<ApplicationStatus>(currentStatus);

  async function updateStatus(newStatus: ApplicationStatus) {
    setLoading(true); setOpen(false);
    await supabase.from("applications").update({ status: newStatus }).eq("id", appId);
    setStatus(newStatus);
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen(!open)} disabled={loading}
        className={`badge ${APPLICATION_STATUS_BADGE[status]} cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1.5`}>
        {loading && <Loader2 size={10} className="animate-spin" />}
        {APPLICATION_STATUS_LABELS[status]}
        <span className="text-xs opacity-60">▾</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-medium border border-[var(--border)] py-1 w-44 animate-scale-in">
            {STATUSES.map((s) => (
              <button key={s} onClick={() => updateStatus(s)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-sand-50 ${s === status ? "font-semibold" : ""}`}>
                <span className={`badge ${APPLICATION_STATUS_BADGE[s]} text-xs`}>{APPLICATION_STATUS_LABELS[s]}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
