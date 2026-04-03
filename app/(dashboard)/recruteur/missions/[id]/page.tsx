import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { ChevronLeft, Edit, Users, Clock } from "lucide-react";
import {
  MISSION_STATUS_LABELS, MISSION_STATUS_BADGE,
  APPLICATION_STATUS_LABELS, APPLICATION_STATUS_BADGE,
  formatDate, formatXAF, timeAgo, initials
} from "@/lib/utils";
import type { MissionStatus, ApplicationStatus } from "@/lib/types/database";
import ApplicationStatusSelector from "@/components/dashboard/ApplicationStatusSelector";

export default async function MissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: mission } = await supabase
    .from("missions").select("*").eq("id", id).eq("producer_id", user.id).single();

  if (!mission) notFound();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, profiles(id, full_name, avatar_url, city, gender, skills, bio, phone)")
    .eq("mission_id", id)
    .order("created_at", { ascending: false });

  const stats = {
    total:       (applications ?? []).length,
    pending:     (applications ?? []).filter((a: any) => a.status === "pending").length,
    shortlisted: (applications ?? []).filter((a: any) => a.status === "shortlisted").length,
    accepted:    (applications ?? []).filter((a: any) => a.status === "accepted").length,
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/recruteur/missions" className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink transition-colors">
          <ChevronLeft size={15} /> Mes missions
        </Link>
        <span className="text-sand-300">/</span>
        <span className="text-sm text-sand-500 truncate max-w-xs">{mission.title}</span>
      </div>

      {/* Mission header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`badge ${MISSION_STATUS_BADGE[mission.status as MissionStatus]}`}>
                {MISSION_STATUS_LABELS[mission.status as MissionStatus]}
              </span>
              <span className="badge badge-sand">{mission.category}</span>
              {mission.is_remote && <span className="badge badge-em">Remote</span>}
            </div>
            <h1 className="font-heading text-h1 text-ink">{mission.title}</h1>
          </div>
          <Link href={`/recruteur/missions/${id}/modifier`} className="btn btn-outline btn-sm flex-shrink-0">
            <Edit size={14} /> Modifier
          </Link>
        </div>

        <p className="text-sand-600 leading-relaxed mb-4">{mission.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[var(--border)]">
          {[
            { label: "Lieu",        value: mission.location ?? "Non précisé" },
            { label: "Budget",      value: mission.budget_min ? `${formatXAF(mission.budget_min)}${mission.budget_max ? ` – ${formatXAF(mission.budget_max)}` : "+"}` : "Non précisé" },
            { label: "Deadline",    value: mission.deadline ? formatDate(mission.deadline) : "—" },
            { label: "Tournage",    value: mission.shooting_date ? formatDate(mission.shooting_date) : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-sand-400 font-mono uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-medium text-ink">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Candidatures */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink flex items-center gap-2">
            <Users size={18} />
            Candidatures
            <span className="badge badge-em">{stats.total}</span>
          </h2>
          <div className="flex gap-3 text-xs text-sand-500">
            <span>{stats.pending} en attente</span>
            <span>·</span>
            <span>{stats.shortlisted} présélectionné{stats.shortlisted > 1 ? "s" : ""}</span>
            <span>·</span>
            <span>{stats.accepted} accepté{stats.accepted > 1 ? "s" : ""}</span>
          </div>
        </div>

        {(applications ?? []).length === 0 ? (
          <div className="card p-12 text-center">
            <Clock size={24} className="text-sand-300 mx-auto mb-3" />
            <p className="font-semibold text-ink">Aucune candidature pour l'instant</p>
            <p className="text-sand-500 text-sm mt-1">
              {mission.status === "draft" ? "Publiez la mission pour recevoir des candidatures." : "Partagez la mission pour attirer des talents."}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {(applications ?? []).map((app: any) => (
              <div key={app.id} className="card p-5">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <Link href={`/talents/${app.profiles?.id}`}
                    className="relative w-12 h-12 rounded-xl overflow-hidden bg-em-100 flex-shrink-0 ring-1 ring-em-200 hover:ring-em-400 transition-all">
                    {app.profiles?.avatar_url ? (
                      <Image src={app.profiles.avatar_url} alt={app.profiles.full_name} fill className="object-cover" />
                    ) : (
                      <span className="w-full h-full flex items-center justify-center text-em-700 font-semibold text-sm">
                        {initials(app.profiles?.full_name ?? "?")}
                      </span>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-1">
                      <Link href={`/talents/${app.profiles?.id}`}
                        className="font-semibold text-ink hover:text-em-700 transition-colors">
                        {app.profiles?.full_name}
                      </Link>
                      <ApplicationStatusSelector appId={app.id} currentStatus={app.status} />
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-sand-400 mb-2">
                      {app.profiles?.city && <span>📍 {app.profiles.city}</span>}
                      {app.profiles?.gender && <span className="capitalize">{app.profiles.gender}</span>}
                      <span>{timeAgo(app.created_at)}</span>
                    </div>

                    {app.profiles?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {app.profiles.skills.slice(0, 4).map((s: string) => (
                          <span key={s} className="badge badge-sand text-xs">{s}</span>
                        ))}
                      </div>
                    )}

                    {app.cover_letter && (
                      <p className="text-sm text-sand-600 line-clamp-2 mt-2 p-3 bg-sand-50 rounded-lg">
                        {app.cover_letter}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
