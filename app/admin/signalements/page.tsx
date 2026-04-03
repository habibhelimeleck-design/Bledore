import { createAdminClient } from "@/lib/supabase/admin";
import { timeAgo } from "@/lib/utils";
import type { ModerationStatus } from "@/lib/types/database";
import { Flag } from "lucide-react";
import FlagActions from "./FlagActions";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_LABELS: Record<ModerationStatus, string> = {
  pending:  "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
};

export default async function AdminSignalementsPage({ searchParams }: Props) {
  const params = await searchParams;
  const admin  = createAdminClient();

  let query = admin
    .from("moderation_flags")
    .select("*, profiles!reporter_id(full_name)")
    .order("created_at", { ascending: false });

  if (params.status) query = query.eq("status", params.status);
  else query = query.eq("status", "pending");

  const { data: flags } = await query;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-heading text-3xl text-ink">Signalements</h1>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {([["", "En attente"], ["approved", "Approuvés"], ["rejected", "Rejetés"]] as const).map(([val, label]) => (
          <a
            key={val}
            href={val ? `/admin/signalements?status=${val}` : "/admin/signalements"}
            className={`badge text-sm px-3 py-1.5 ${
              (!params.status && !val) || params.status === val
                ? "badge-em font-semibold"
                : "badge-sand hover:bg-sand-100"
            }`}>
            {label}
          </a>
        ))}
      </div>

      {(flags ?? []).length === 0 ? (
        <div className="card p-16 text-center">
          <Flag size={28} className="text-sand-300 mx-auto mb-3" />
          <p className="text-sand-500 text-sm">Aucun signalement dans cette catégorie.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {(flags ?? []).map((flag: any) => (
            <div key={flag.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge badge-sand capitalize text-xs">{flag.target_table}</span>
                    <span className={`badge text-xs ${
                      flag.status === "pending"  ? "badge-pending" :
                      flag.status === "approved" ? "badge-accepted" :
                      "badge-rejected"
                    }`}>
                      {STATUS_LABELS[flag.status as ModerationStatus]}
                    </span>
                  </div>
                  <p className="font-medium text-ink text-sm">{flag.reason}</p>
                  <p className="text-sand-400 text-xs mt-1">
                    Signalé par {flag.profiles?.full_name ?? "anonyme"} · {timeAgo(flag.created_at)}
                  </p>
                  {flag.admin_note && (
                    <p className="text-sand-600 text-xs mt-2 italic">Note admin : {flag.admin_note}</p>
                  )}
                </div>
                {flag.status === "pending" && (
                  <FlagActions flagId={flag.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
