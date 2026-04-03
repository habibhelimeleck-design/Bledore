"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function FlagActions({ flagId }: { flagId: string }) {
  const supabase = createClient();
  const router   = useRouter();
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function update(status: "approved" | "rejected") {
    setLoading(status === "approved" ? "approve" : "reject");
    await supabase.from("moderation_flags").update({
      status,
      resolved_at: new Date().toISOString(),
    }).eq("id", flagId);
    router.refresh();
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button onClick={() => update("approved")} disabled={!!loading} className="btn btn-em btn-sm">
        {loading === "approve" ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
        Approuver
      </button>
      <button onClick={() => update("rejected")} disabled={!!loading} className="btn btn-danger btn-sm">
        {loading === "reject" ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
        Rejeter
      </button>
    </div>
  );
}
