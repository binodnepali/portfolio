import { ProfileVariant } from "../../types/ProfileVariant.ts";
import { deleteVariantFromKv, listKvVariantSlugs } from "./variantStore.ts";
import { loadVariant } from "./variant.ts";

const VARIANTS_DIR = new URL("../../../data/variants/", import.meta.url);

export interface VariantSummary {
  slug: string;
  label?: string;
  target_company?: string;
  target_role?: string;
  created_at?: string;
  in_kv: boolean;
  in_file: boolean;
  preview_url: string;
}

async function listFileVariantSlugs(): Promise<string[]> {
  try {
    const slugs: string[] = [];
    for await (const entry of Deno.readDir(VARIANTS_DIR)) {
      if (entry.isFile && entry.name.endsWith(".json")) {
        slugs.push(entry.name.replace(/\.json$/, ""));
      }
    }
    return slugs;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return [];
    throw err;
  }
}

function toSummary(
  slug: string,
  variant: ProfileVariant | null,
  inKv: boolean,
  inFile: boolean,
): VariantSummary {
  return {
    slug,
    label: variant?.label,
    target_company: variant?.target_company,
    target_role: variant?.target_role,
    created_at: variant?.created_at,
    in_kv: inKv,
    in_file: inFile,
    preview_url: `/cv/${slug}`,
  };
}

export async function listVariantSummaries(): Promise<VariantSummary[]> {
  const kvSlugs = new Set(await listKvVariantSlugs());
  const fileSlugs = new Set(await listFileVariantSlugs());
  const slugs = [...new Set([...kvSlugs, ...fileSlugs])];

  const summaries = await Promise.all(
    slugs.map(async (slug) => {
      const variant = await loadVariant(slug);
      return toSummary(slug, variant, kvSlugs.has(slug), fileSlugs.has(slug));
    }),
  );

  return summaries.sort((a, b) => {
    const aTime = a.created_at ? Date.parse(a.created_at) : 0;
    const bTime = b.created_at ? Date.parse(b.created_at) : 0;
    return bTime - aTime;
  });
}

async function deleteVariantFromFile(slug: string): Promise<boolean> {
  const path = new URL(`${slug}.json`, VARIANTS_DIR);
  try {
    await Deno.remove(path);
    return true;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return false;
    throw err;
  }
}

export async function deleteVariantEverywhere(
  slug: string,
): Promise<{ kv: boolean; file: boolean }> {
  const kv = await deleteVariantFromKv(slug);
  const file = await deleteVariantFromFile(slug);
  return { kv, file };
}

export async function deleteVariantsOlderThan(
  days: number,
  options: { dryRun?: boolean } = {},
): Promise<{ deleted: string[]; skipped: string[] }> {
  if (!Number.isFinite(days) || days < 1) {
    throw new Error("olderThanDays must be a positive number");
  }

  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const summaries = await listVariantSummaries();
  const deleted: string[] = [];
  const skipped: string[] = [];

  for (const summary of summaries) {
    if (!summary.created_at) {
      skipped.push(summary.slug);
      continue;
    }
    const created = Date.parse(summary.created_at);
    if (Number.isNaN(created) || created >= cutoff) continue;

    if (!options.dryRun) {
      await deleteVariantEverywhere(summary.slug);
    }
    deleted.push(summary.slug);
  }

  return { deleted, skipped };
}

export async function variantExists(slug: string): Promise<boolean> {
  const kvSlugs = await listKvVariantSlugs();
  if (kvSlugs.includes(slug)) return true;
  const fileSlugs = await listFileVariantSlugs();
  return fileSlugs.includes(slug);
}
