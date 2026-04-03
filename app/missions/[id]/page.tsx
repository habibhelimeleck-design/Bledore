import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatDate, formatDateShort, formatXAF,
  MISSION_STATUS_LABELS, MISSION_STATUS_BADGE,
} from "@/lib/utils";
import type { MissionStatus } from "@/lib/types/database";
import { MapPin, Calendar, Banknote, Clock, Users, CheckCircle2, ChevronLeft } from "lucide-react";
import ApplyButton from "./ApplyButton";

export default async function PublicMissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: missionRaw } = await supabase
    .from("missions")
    .select(`*, profiles ( full_name, avatar_url, producer_accounts ( company_name, logo_url, is_verified, sector ) )`)
    .eq("id", id)
    .single();

  if (!missionRaw) notFound();

  // Flatten nested producer_accounts for convenience
  const mission = missionRaw as any;

  const { data: { user } } = await supabase.auth.getUser();

  // Check user profile role
  let userRole: string | null = null;
  let alreadyApplied = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles").select("role").eq("id", user.id).single();
    userRole = profile?.role ?? null;

    if (userRole === "talent") {
      const { data: existing } = await supabase
        .from("applications").select("id").eq("mission_id", id).eq("talent_id", user.id).single();
      alreadyApplied = !!existing;
    }
  }

  const isOpen = mission.status === "published";
  const producer = mission.profiles?.producer_accounts;
  const producerName = producer?.company_name ?? mission.profiles?.full_name ?? "Recruteur";

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Nav */}
      <div className="border-b border-[var(--border)] bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-em-900 flex items-center justify-center">
              <span className="font-heading font-semibold text-white text-xs">E</span>
            </div>
            <span className="font-heading text-lg font-semibold text-ink">
              E.<span className="text-em-500">Talent</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href={userRole === "talent" ? "/talent" : "/recruteur"} className="btn btn-outline btn-sm">
                Tableau de bord
              </Link>
            ) : (
              <>
                <Link href="/connexion" className="btn btn-ghost btn-sm">Se connecter</Link>
                <Link href="/inscription" className="btn btn-em btn-sm">Rejoindre</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Link href={userRole === "talent" ? "/talent/missions" : "/"} className="inline-flex items-center gap-1 text-sm text-sand-500 hover:text-ink transition-colors mb-6">
          <ChevronLeft size={15} /> Retour aux missions
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Header card */}
            <div className="card p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-em-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-em-700 text-2xl">{mission.category[0]}</span>
                </div>
                <span className={`badge ${MISSION_STATUS_BADGE[mission.status as MissionStatus]} flex-shrink-0`}>
                  {MISSION_STATUS_LABELS[mission.status as MissionStatus]}
                </span>
              </div>
              <h1 className="font-heading text-2xl text-ink mb-2">{mission.title}</h1>
              <p className="text-sand-600 text-sm mb-4">
                {producerName}
                {producer?.is_verified && (
                  <span className="ml-2 badge badge-em text-xs">✓ Vérifié</span>
                )}
              </p>

              <div className="flex flex-wrap gap-3 text-sm text-sand-500">
                {mission.location && (
                  <span className="flex items-center gap-1.5"><MapPin size={14} />{mission.location}</span>
                )}
                {mission.is_remote && (
                  <span className="flex items-center gap-1.5"><CheckCircle2 size={14} />À distance</span>
                )}
                {mission.deadline && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />Deadline {formatDateShort(mission.deadline)}
                  </span>
                )}
                {mission.shooting_date && (
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />Tournage {formatDateShort(mission.shooting_date)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-heading text-lg text-ink mb-3">Description de la mission</h2>
              <p className="text-sand-600 leading-relaxed whitespace-pre-line">{mission.description}</p>
            </div>

            {/* Requirements */}
            <div className="card p-6">
              <h2 className="font-heading text-lg text-ink mb-4">Profil recherché</h2>
              <dl className="flex flex-col gap-3">
                {(mission.required_skills ?? []).length > 0 && (
                  <div>
                    <dt className="text-sand-500 text-xs font-medium uppercase tracking-wide mb-1.5">Compétences</dt>
                    <dd className="flex flex-wrap gap-1.5">
                      {(mission.required_skills as string[]).map((s) => (
                        <span key={s} className="badge badge-em">{s}</span>
                      ))}
                    </dd>
                  </div>
                )}
                {mission.required_gender && (
                  <div className="flex items-center justify-between py-2 border-t border-[var(--border)]">
                    <dt className="text-sand-500 text-sm">Genre</dt>
                    <dd className="text-ink text-sm font-medium capitalize">{mission.required_gender}</dd>
                  </div>
                )}
                {(mission.required_age_min || mission.required_age_max) && (
                  <div className="flex items-center justify-between py-2 border-t border-[var(--border)]">
                    <dt className="text-sand-500 text-sm">Âge</dt>
                    <dd className="text-ink text-sm font-medium">
                      {mission.required_age_min && mission.required_age_max
                        ? `${mission.required_age_min} – ${mission.required_age_max} ans`
                        : mission.required_age_min
                        ? `${mission.required_age_min} ans min.`
                        : `${mission.required_age_max} ans max.`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Apply card */}
            <div className="card p-5 sticky top-20">
              <div className="mb-4">
                {mission.budget_min ? (
                  <div>
                    <p className="text-sand-500 text-xs mb-0.5">Rémunération</p>
                    <p className="font-heading text-xl text-ink">
                      {formatXAF(mission.budget_min)}
                      {mission.budget_max && mission.budget_max !== mission.budget_min && (
                        <span className="text-sand-400"> – {formatXAF(mission.budget_max)}</span>
                      )}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sand-500 text-xs mb-0.5">Rémunération</p>
                    <p className="text-ink font-medium">Non rémunéré</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 text-xs text-sand-500 mb-5 pb-4 border-b border-[var(--border)]">
                <span className="badge badge-sand self-start">{mission.category}</span>
                {mission.deadline && (
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />Date limite : {formatDate(mission.deadline, { day: "numeric", month: "long" })}
                  </span>
                )}
              </div>

              <ApplyButton
                missionId={id}
                isOpen={isOpen}
                userRole={userRole}
                alreadyApplied={alreadyApplied}
              />
            </div>

            {/* Producer card */}
            <div className="card p-5">
              <p className="text-sand-500 text-xs font-medium uppercase tracking-wide mb-3">Recruteur</p>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-em-100 flex items-center justify-center flex-shrink-0">
                  <span className="font-heading text-em-700 font-semibold">
                    {producerName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{producerName}</p>
                  {producer?.sector && <p className="text-sand-500 text-xs">{producer.sector}</p>}
                </div>
              </div>
              {producer?.is_verified && (
                <div className="flex items-center gap-1.5 text-em-700 text-xs">
                  <CheckCircle2 size={13} />
                  <span>Recruteur vérifié E.Talent</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
