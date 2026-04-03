import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApplicationStatus, MissionStatus } from "@/lib/types/database";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Format currency (XAF) ───────────────────────────────────────
export function formatXAF(amount: number | null | undefined): string {
  if (!amount) return "Non précisé";
  return new Intl.NumberFormat("fr-GA", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ── Format date (French) ────────────────────────────────────────
export function formatDate(date: string | null | undefined, opts?: Intl.DateTimeFormatOptions): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", opts ?? { day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}

export function formatDateShort(date: string | null | undefined): string {
  return formatDate(date, { day: "numeric", month: "short" });
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1)  return "À l'instant";
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24)   return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7)     return `Il y a ${days}j`;
  return formatDateShort(date);
}

// ── Application status helpers ──────────────────────────────────
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending:     "En attente",
  viewed:      "Vue",
  shortlisted: "Présélectionné",
  accepted:    "Accepté",
  rejected:    "Refusé",
};

export const APPLICATION_STATUS_BADGE: Record<ApplicationStatus, string> = {
  pending:     "badge-pending",
  viewed:      "badge-viewed",
  shortlisted: "badge-shortlisted",
  accepted:    "badge-accepted",
  rejected:    "badge-rejected",
};

// ── Mission status helpers ──────────────────────────────────────
export const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  draft:     "Brouillon",
  published: "Publiée",
  closed:    "Fermée",
  archived:  "Archivée",
};

export const MISSION_STATUS_BADGE: Record<MissionStatus, string> = {
  draft:     "badge-draft",
  published: "badge-published",
  closed:    "badge-closed",
  archived:  "badge-sand",
};

// ── Gabon cities ────────────────────────────────────────────────
export const GABON_CITIES = [
  "Libreville",
  "Port-Gentil",
  "Franceville",
  "Oyem",
  "Moanda",
  "Mouila",
  "Lambaréné",
  "Tchibanga",
  "Koulamoutou",
  "Makokou",
];

// ── Mission categories ──────────────────────────────────────────
export const MISSION_CATEGORIES = [
  "Publicité",
  "Clip musical",
  "Film / Série",
  "Événement",
  "Défilé / Mode",
  "Photographie",
  "Contenu réseaux sociaux",
  "Documentaire",
  "Voix off",
  "Autre",
];

// ── Talent skills ───────────────────────────────────────────────
export const TALENT_SKILLS = [
  "Acting",
  "Danse",
  "Chant",
  "Rap / Spoken word",
  "Mannequinat",
  "Voix off",
  "Comédie",
  "Acrobatie",
  "Sports",
  "Création de contenu",
  "Photographie",
  "Maquillage",
  "Coiffure",
];

// ── Languages ────────────────────────────────────────────────────
export const GABON_LANGUAGES = [
  "Français",
  "Fang",
  "Myéné",
  "Nzebi",
  "Punu",
  "Kota",
  "Mbede",
  "Sango",
  "Anglais",
];

// ── Build Supabase Storage public URL ───────────────────────────
export function storageUrl(bucket: string, path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

// ── Initials from name ──────────────────────────────────────────
export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
