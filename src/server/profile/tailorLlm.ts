import { generateVariantWithGemini } from "./generateVariant.ts";
import { ProfileVariant } from "../../types/ProfileVariant.ts";
import { saveVariant } from "./variant.ts";

export async function generateVariant(
  slug: string,
  jobDescription: string,
): Promise<ProfileVariant> {
  return await generateVariantWithGemini(slug, jobDescription);
}

export async function writeVariant(variant: ProfileVariant): Promise<string> {
  await saveVariant(variant);
  return `data/variants/${variant.slug}.json`;
}
