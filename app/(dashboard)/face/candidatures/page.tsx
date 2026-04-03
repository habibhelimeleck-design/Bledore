import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUS_BADGE, formatDate, timeAgo } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types/database";
import { Briefcase } from "lucide-react";

export default async function FaceCandidaturesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      missions (
        id, title, category, status, deadline, location, budget_min, budget_max, currency,
        profiles ( full_name, avatar_url, producer_accounts ( company_name, logo_url, is_verified ) )
      )
    `)
    .eq("face_id", user.id)
    .order("created_at", { ascending: false });

  const grouped = {
    active:  (applications ?? []).filter((a) => ["pending","viewed","shortlisted"].includes(a.status)),
    done:    (applications ?? []).filter((a) => ["accepted","rejected"].includes(a.status)),
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Mes activités</p>
        <h1 className="font-heading text-h1 text-ink">Mes candidatures</h1>
        <p className="text-sand-500 text-sm mt-1">{(applications ?? []).length} candidature{(applications ?? []).length > 1 ? "s" : ""} au total</p>
      </div>

      {(applications ?? []).length === 0 ? (
        <div className="card p-16 text-center">
          <Briefcase size={32} className="text-sand-300 mx-auto mb-4" />
          <p className="font-heading text-xl text-ink mb-2">Aucune candidature</p>
          <p className="text-sand-500 text-sm mb-6">Explorez les missions disponibles et postulez.</p>
          <Link href="/face/missions" className="btn btn-em">Voir les missions</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Active */}
          {grouped.active.length > 0 && (
            <div>
              <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
                En cours
                <span className="badge badge-em">{grouped.active.length}</span>
              </h2>
              <div className="flex flex-col gap-3">
                {grouped.active.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}

          {/* Done */}
          {grouped.done.length > 0 && (
            <div>
              <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
                Terminées
                <span className="badge badge-sand">{grouped.done.length}</span>
              </h2>
              <div className="flex flex-col gap-3">
                {grouped.done.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app }: { app: any }) {
  const mission = app.missions;
  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-em-100 flex-shrink-0 flex items-center justify-center">
          <span className="font-heading text-em-700 text-lg font-semibold">
            {mission?.category?.[0] ?? "M"}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link href={`/missions/${mission?.id}`}
                className="font-semibold text-ink hover:text-em-700 transition-colors truncate block">
                {mission?.title}
              </Link>
              <p className="text-sand-500 text-sm">
                {(mission?.profiles as any)?.producer_accounts?.company_name ?? mission?.profiles?.full_name}
                {mission?.location && ` · ${mission.location}`}
              </p>
            </div>
            <span className={`badge ${APPLICATION_STATUS_BADGE[app.status as ApplicationStatus]} flex-shrink-0`}>
              {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]">
            <span className="badge badge-sand">{mission?.category}</span>
            {mission?.deadline && (
              <span className="text-xs text-sand-400">
                Deadline : {formatDate(mission.deadline, { day: "numeric", month: "short" })}
              </span>
            )}
            <span className="text-xs text-sand-400 ml-auto">Postulé {timeAgo(app.created_at)}</span>
          </div>

          {app.cover_letter && (
            <div className="mt-3 p-3 rounded-lg bg-sand-50 text-sm text-sand-600 line-clamp-2">
              {app.cover_letter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
