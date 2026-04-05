import { createClient } from "@/lib/supabase/server";
import TalentsClient, { type TalentCardData } from "./TalentsClient";

/* Skills → catégories de filtrage */
const SKILL_TO_CATEGORY: Record<string, string> = {
  "Photographie": "Photographie",
  "Création de contenu": "Création de contenu",
  "Acting": "Acteurs",
  "Comédie": "Acteurs",
  "Mannequinat": "Mannequins",
  "Voix off": "Voix",
  "Chant": "Voix",
  "Rap / Spoken word": "Voix",
};

function skillsToCategories(skills: string[] | null): string[] {
  if (!skills?.length) return [];
  const cats = new Set<string>();
  for (const s of skills) {
    const cat = SKILL_TO_CATEGORY[s];
    if (cat) cats.add(cat);
  }
  return Array.from(cats);
}

export default async function TalentsSection() {
  const supabase = await createClient();

  const { data: dbProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, city, skills, avatar_url, bio")
    .eq("role", "talent")
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(9);

  const talents: TalentCardData[] = (dbProfiles ?? []).map((p) => {
    const skills = p.skills as string[] | null;
    return {
      id: p.id,
      name: p.full_name ?? "Talent",
      role: (p.bio as string | null) ?? (skills?.[0] ?? "Talent"),
      city: (p.city as string | null) ?? "Gabon",
      rating: null,
      missions: null,
      verified: false,
      categories: skillsToCategories(skills),
      image: (p.avatar_url as string | null) ?? null,
      specialty: skills?.join(", ") ?? "",
    };
  });

  return <TalentsClient talents={talents} />;
}