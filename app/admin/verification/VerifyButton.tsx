"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function VerifyButton({ producerAccountId }: { producerAccountId: string }) {
  const supabase = createClient();
  const router   = useRouter();
  const [loading, setLoading] = useState(false);

  async function verify() {
    setLoading(true);
    await supabase.from("producer_accounts").update({ is_verified: true }).eq("id", producerAccountId);
    router.refresh();
  }

  return (
    <button onClick={verify} disabled={loading} className="btn btn-em btn-sm flex-shrink-0">
      {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
      Vérifier
    </button>
  );
}
