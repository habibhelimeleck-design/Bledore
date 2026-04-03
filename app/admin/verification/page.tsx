import { createAdminClient } from "@/lib/supabase/admin";
import { timeAgo } from "@/lib/utils";
import { CheckCircle2, Globe } from "lucide-react";
import VerifyButton from "./VerifyButton";

export default async function AdminVerificationPage() {
  const admin = createAdminClient();

  const { data: pending } = await admin
    .from("producer_accounts")
    .select("*, profiles(id, full_name, phone, city, created_at)")
    .eq("is_verified", false)
    .order("created_at", { ascending: false });

  const { data: verified } = await admin
    .from("producer_accounts")
    .select("*, profiles(full_name)")
    .eq("is_verified", true)
    .order("updated_at", { ascending: false })
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <p className="text-sand-400 font-mono text-xs uppercase tracking-widest mb-1">Admin</p>
        <h1 className="font-heading text-3xl text-ink">Vérification des recruteurs</h1>
      </div>

      {/* Pending */}
      <h2 className="font-heading text-lg text-ink mb-3 flex items-center gap-2">
        En attente
        <span className="badge badge-pending">{(pending ?? []).length}</span>
      </h2>

      {(pending ?? []).length === 0 ? (
        <div className="card p-10 text-center mb-8">
          <CheckCircle2 size={28} className="text-em-400 mx-auto mb-2" />
          <p className="text-sand-500 text-sm">Aucune vérification en attente.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 mb-8">
          {(pending ?? []).map((pa: any) => (
            <div key={pa.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-ink">{pa.company_name}</h3>
                    {pa.sector && <span className="badge badge-sand text-xs">{pa.sector}</span>}
                  </div>
                  <p className="text-sand-500 text-sm">Gérant : {pa.profiles?.full_name}</p>
                  {pa.profiles?.city && <p className="text-sand-400 text-xs">{pa.profiles.city}</p>}
                  {pa.website && (
                    <a href={pa.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-em-600 text-xs mt-1 hover:underline">
                      <Globe size={11} />{pa.website}
                    </a>
                  )}
                  {pa.description && (
                    <p className="text-sand-600 text-sm mt-2 max-w-prose">{pa.description}</p>
                  )}
                  <p className="text-sand-400 text-xs mt-2">Inscrit {timeAgo(pa.profiles?.created_at)}</p>
                </div>
                <VerifyButton producerAccountId={pa.id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recently verified */}
      {(verified ?? []).length > 0 && (
        <>
          <h2 className="font-heading text-lg text-ink mb-3">Récemment vérifiés</h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[var(--border)]">
                {(verified ?? []).map((pa: any) => (
                  <tr key={pa.id} className="hover:bg-sand-50">
                    <td className="px-4 py-3 font-medium text-ink">{pa.company_name}</td>
                    <td className="px-4 py-3 text-sand-500">{pa.profiles?.full_name}</td>
                    <td className="px-4 py-3">
                      <span className="badge badge-accepted">Vérifié</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
