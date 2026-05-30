import { ProfileVariant } from "../../types/ProfileVariant.ts";

const KV_VARIANT_PREFIX = ["profile", "variants"] as const;
const MAX_KV_VALUE_BYTES = 64 * 1024;

let kvPromise: Promise<Deno.Kv | null> | null = null;

function getKv(): Promise<Deno.Kv | null> {
  if (!kvPromise) {
    kvPromise = (async () => {
      if (typeof Deno.openKv !== "function") return null;
      try {
        return await Deno.openKv();
      } catch {
        return null;
      }
    })();
  }
  return kvPromise;
}

function variantKey(slug: string): string[] {
  return [...KV_VARIANT_PREFIX, slug];
}

function variantSize(variant: ProfileVariant): number {
  return new TextEncoder().encode(JSON.stringify(variant)).byteLength;
}

export async function loadVariantFromKv(
  slug: string,
): Promise<ProfileVariant | null> {
  const kv = await getKv();
  if (!kv) return null;
  const res = await kv.get<ProfileVariant>(variantKey(slug));
  return res.value ?? null;
}

export async function saveVariantToKv(
  variant: ProfileVariant,
): Promise<boolean> {
  const kv = await getKv();
  if (!kv) return false;

  const size = variantSize(variant);
  if (size > MAX_KV_VALUE_BYTES) {
    throw new Error(
      `Variant JSON is ${size} bytes (max ${MAX_KV_VALUE_BYTES}). ` +
        "Shorten descriptions or omit job_description.",
    );
  }

  try {
    await kv.set(variantKey(variant.slug), variant);
    return true;
  } catch (err) {
    console.warn("[variants] KV save failed:", err);
    return false;
  }
}

export async function listKvVariantSlugs(): Promise<string[]> {
  const kv = await getKv();
  if (!kv) return [];

  const slugs: string[] = [];
  const prefix = [...KV_VARIANT_PREFIX];
  for await (const entry of kv.list({ prefix })) {
    const slug = entry.key[prefix.length];
    if (typeof slug === "string") slugs.push(slug);
  }
  return slugs.sort();
}

export async function deleteVariantFromKv(slug: string): Promise<boolean> {
  const kv = await getKv();
  if (!kv) return false;
  await kv.delete(variantKey(slug));
  return true;
}
