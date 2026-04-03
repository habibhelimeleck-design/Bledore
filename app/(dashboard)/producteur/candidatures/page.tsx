import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import {
  APPLICATION_STATUS_LABELS, APPLICATION_STATUS_BADGE,
  formatDate, timeAgo, initials,
} from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/types/database";
import { Briefcase, ChevronRight } from "lucide-react";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function ProducteurCandidaturesPage({ searchParams }: Props) {
  const params   = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Get all producer missions first
  const { data: missions } = await supabase
    .from("missions")
    .select("id, title")
    .eq("producer_id", user.id);

  const missionIds = (missions ?? []).map((m: any) => m.id);

  let query = supabase
    .from("applications")
    .select(`
      *,
      profiles ( id, full_name, avatar_url, city, skills, gender ),
      missions ( id, title, category, status )
    `)
    .order("created_at", { ascending: false });

  if (missionIds.length > 0) {
    query = query.in("mission_id", missionIds);
  } else {
    // No missions → empty result
    return <EmptyState />;
  }

  if (params.status) query = query.eq("status", params.status as ApplicationStatus);

  const { data: applications } = await query;

  const ALL_STATUSES: ApplicationStatus[] = ["pending", "viewed", "shortlisted", "accepted", "rejected"];
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = (applications ?? []).filter((a: any) => a.status === s).length;
    return acc;
  }, {} as Record<ApplicationStatus, number>);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Vue globale</p>
        <h1 className="font-heading text-h1 text-ink">Candidatures reçues</h1>
        <p className="text-sand-500 text-sm mt-1">
          {(applications ?? []).length} candidature{(applications ?? []).length !== 1 ? "s" : ""} au total
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/producteur/candidatures"
          className={`badge text-sm px-3 py-1.5 ${!params.status ? "badge-em font-semibold" : "badge-sand hover:bg-sand-100"}`}>
          Toutes ({(applications ?? []).length + (params.status ? 0 : 0)})
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/producteur/candidatures?status=${s}`}
            className={`badge text-sm px-3 py-1.5 ${params.status === s ? `${APPLICATION_STATUS_BADGE[s]} font-semibold` : "badge-sand hover:bg-sand-100"}`}>
            {APPLICATION_STATUS_LABELS[s]} ({counts[s]})
          </Link>
        ))}
      </div>

      {(applications ?? []).length === 0 ? (
        <EmptyState filtered={!!params.status} />
      ) : (
        <div className="flex flex-col gap-3">
          {(applications ?? []).map((app: any) => (
            <ApplicationRow key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationRow({ app }: { app: any }) {
  const profile = app.profiles;
  const mission = app.missions;

  return (
    <Link href={`/producteur/missions/${mission?.id}`}
      className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow group">
      {/* Avatar */}
      <div className="relative w-11 h-11 rounded-full bg-em-100 flex-shrink-0 overflow-hidden">
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt={profile.full_name} fill className="object-cover" />
        ) : (
          <span className="w-full h-full flex items-center justify-center font-heading text-em-700 font-semibold text-sm">
            {initials(profile?.full_name ?? "?")}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="font-semibold text-ink text-sm truncate group-hover:text-em-700 transition-colors">
            {profile?.full_name}
          </p>
          {profile?.city && (
            <span className="text-sand-400 text-xs flex-shrink-0">· {profile.city}</span>
          )}
        </div>
        <p className="text-sand-500 text-xs truncate">
          Pour : <span className="text-sand-700 font-medium">{mission?.title}</span>
        </p>
        {(profile?.skills ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {(profile.skills as string[]).slice(0, 2).map((s: string) => (
              <span key={s} className="badge badge-sand" style={{ fontSize: "0.65rem", padding: "0 6px" }}>{s}</span>
            ))}
          </div>
        )}
      </div>

      {/* Status + date */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`badge ${APPLICATION_STATUS_BADGE[app.status as ApplicationStatus]}`}>
          {APPLICATION_STATUS_LABELS[app.status as ApplicationStatus]}
        </span>
        <span className="text-xs text-sand-400">{timeAgo(app.created_at)}</span>
      </div>

      <ChevronRight size={15} className="text-sand-300 group-hover:text-em-500 transition-colors flex-shrink-0" />
    </Link>
  );
}

function EmptyState({ filtered }: { filtered?: boolean }) {
  return (
    <div className="card p-16 text-center">
      <Briefcase size={32} className="text-sand-300 mx-auto mb-4" />
      <p className="font-heading text-xl text-ink mb-2">
        {filtered ? "Aucune candidature pour ce statut" : "Aucune candidature reçue"}
      </p>
      <p className="text-sand-500 text-sm mb-6">
        {filtered
          ? "Essayez un autre filtre de statut."
          : "Publiez des missions pour recevoir des candidatures de talents."}
      </p>
      {!filtered && (
        <Link href="/producteur/missions/nouvelle" className="btn btn-em">Créer une mission</Link>
      )}
    </div>
  );
}
