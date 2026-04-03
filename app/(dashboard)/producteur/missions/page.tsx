import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MISSION_STATUS_LABELS, MISSION_STATUS_BADGE, formatDate, formatXAF } from "@/lib/utils";
import type { MissionStatus } from "@/lib/types/database";
import MissionActions from "@/components/dashboard/MissionActions";

export default async function ProducteurMissionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  const { data: missions } = await supabase
    .from("missions")
    .select("*, applications(count)")
    .eq("producer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Gestion</p>
          <h1 className="font-heading text-h1 text-ink">Mes missions</h1>
        </div>
        <Link href="/producteur/missions/nouvelle" className="btn btn-em">
          <Plus size={16} /> Nouvelle mission
        </Link>
      </div>

      {(missions ?? []).length === 0 ? (
        <div className="card p-16 text-center">
          <p className="font-heading text-xl text-ink mb-2">Aucune mission créée</p>
          <p className="text-sand-500 text-sm mb-6">Publiez votre première mission pour trouver des talents.</p>
          <Link href="/producteur/missions/nouvelle" className="btn btn-em">
            <Plus size={16} /> Créer une mission
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(missions ?? []).map((m: any) => (
            <div key={m.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`badge ${MISSION_STATUS_BADGE[m.status as MissionStatus]}`}>
                      {MISSION_STATUS_LABELS[m.status as MissionStatus]}
                    </span>
                    <span className="badge badge-sand">{m.category}</span>
                    {m.applications?.[0]?.count > 0 && (
                      <span className="badge badge-em">{m.applications[0].count} candidature{m.applications[0].count > 1 ? "s" : ""}</span>
                    )}
                  </div>
                  <Link href={`/producteur/missions/${m.id}`}
                    className="font-semibold text-ink hover:text-em-700 transition-colors text-base">
                    {m.title}
                  </Link>
                  <p className="text-sand-500 text-sm line-clamp-2 mt-1">{m.description}</p>
                  <div className="flex gap-4 mt-3 text-xs text-sand-400">
                    {m.location && <span>📍 {m.location}</span>}
                    {m.budget_min && <span>💰 {formatXAF(m.budget_min)}</span>}
                    {m.deadline && <span>📅 Deadline {formatDate(m.deadline, { day: "numeric", month: "short" })}</span>}
                    <span className="ml-auto">Créée le {formatDate(m.created_at, { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link href={`/producteur/missions/${m.id}/modifier`}
                    className="btn btn-ghost btn-sm p-2.5" title="Modifier">
                    <Edit size={15} />
                  </Link>
                  <MissionActions missionId={m.id} status={m.status} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
