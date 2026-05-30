import { Profile } from "../../types/Profile.ts";
import { ProfileVariant } from "../../types/ProfileVariant.ts";
import profileData from "../../../data/linkedin-profile.json" with {
  type: "json",
};
import { experienceId, projectId } from "./ids.ts";
import {
  listKvVariantSlugs,
  loadVariantFromKv,
  saveVariantToKv,
} from "./variantStore.ts";

const VARIANTS_DIR = new URL("../../../data/variants/", import.meta.url);

export interface ProfileCatalogItem {
  id: string;
  title: string;
  subtitle?: string;
}

export interface ProfileCatalog {
  experiences: ProfileCatalogItem[];
  projects: ProfileCatalogItem[];
  skills: string[];
}

export function buildProfileCatalog(profile: Profile): ProfileCatalog {
  return {
    experiences: profile.experiences.map((exp) => ({
      id: experienceId(exp),
      title: `${exp.title} @ ${exp.company}`,
      subtitle: exp.description?.split("\n")[0]?.replace(/^-\s*/, "") ??
        undefined,
    })),
    projects: profile.accomplishment_projects.map((p) => ({
      id: projectId(p),
      title: p.title,
      subtitle: p.description?.split("\n")[0]?.replace(/^-\s*/, "") ??
        undefined,
    })),
    skills: profile.skills.map((s) => s.name.trim()),
  };
}

export async function listVariantSlugs(): Promise<string[]> {
  const slugs = new Set(await listKvVariantSlugs());
  try {
    for await (const entry of Deno.readDir(VARIANTS_DIR)) {
      if (entry.isFile && entry.name.endsWith(".json")) {
        slugs.add(entry.name.replace(/\.json$/, ""));
      }
    }
  } catch (err) {
    if (!(err instanceof Deno.errors.NotFound)) throw err;
  }
  return [...slugs].sort();
}

async function loadVariantFromFile(
  slug: string,
): Promise<ProfileVariant | null> {
  const path = new URL(`${slug}.json`, VARIANTS_DIR);
  try {
    const text = await Deno.readTextFile(path);
    return JSON.parse(text) as ProfileVariant;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return null;
    throw err;
  }
}

export async function loadVariant(
  slug: string,
): Promise<ProfileVariant | null> {
  const fromKv = await loadVariantFromKv(slug);
  if (fromKv) return fromKv;
  return await loadVariantFromFile(slug);
}

async function saveVariantToFile(variant: ProfileVariant): Promise<void> {
  await Deno.mkdir(VARIANTS_DIR, { recursive: true });
  const path = new URL(`${variant.slug}.json`, VARIANTS_DIR);
  await Deno.writeTextFile(path, JSON.stringify(variant, null, 2) + "\n");
}

export async function saveVariant(
  variant: ProfileVariant,
): Promise<{ kv: boolean; file: boolean }> {
  const kv = await saveVariantToKv(variant);
  let file = false;
  try {
    await saveVariantToFile(variant);
    file = true;
  } catch (err) {
    console.warn("[variants] file save skipped:", err);
  }
  return { kv, file };
}

function filterByIds<T>(
  items: T[],
  ids: string[] | undefined,
  getId: (item: T) => string,
): T[] {
  if (!ids || ids.length === 0) return items;
  const byId = new Map(items.map((item) => [getId(item), item]));
  return ids.map((id) => byId.get(id)).filter((item): item is T =>
    item != null
  );
}

function filterSkills(
  profile: Profile,
  skillNames: string[] | undefined,
): Profile["skills"] {
  if (!skillNames || skillNames.length === 0) return profile.skills;
  const byName = new Map(
    profile.skills.map((s) => [s.name.trim().toLowerCase(), s]),
  );
  return skillNames
    .map((name) => byName.get(name.trim().toLowerCase()))
    .filter((s): s is Profile["skills"][number] => s != null)
    .map((s) => ({ ...s, include_in_cv: true }));
}

export function applyVariant(
  master: Profile,
  variant: ProfileVariant,
): Profile {
  const profile = structuredClone(master) as Profile;

  if (variant.summary) profile.summary = variant.summary;
  if (variant.occupation) profile.occupation = variant.occupation;

  profile.experiences = filterByIds(
    profile.experiences,
    variant.experience_ids,
    experienceId,
  ).map((exp) => {
    const id = experienceId(exp);
    const description = variant.experience_descriptions?.[id];
    return description != null ? { ...exp, description } : exp;
  });

  profile.accomplishment_projects = filterByIds(
    profile.accomplishment_projects,
    variant.project_ids,
    projectId,
  ).map((project) => {
    const id = projectId(project);
    const description = variant.project_descriptions?.[id];
    const updated = description != null ? { ...project, description } : project;
    return { ...updated, include_in_cv: true };
  });

  profile.skills = filterSkills(profile, variant.skill_names);

  return profile;
}

export async function getProfileForVariant(
  slug: string,
): Promise<{ profile: Profile; variant: ProfileVariant } | null> {
  const variant = await loadVariant(slug);
  if (!variant) return null;
  const master = profileData as Profile;
  return { profile: applyVariant(master, variant), variant };
}
