import {
  buildTailorSystemPrompt,
  buildTailorUserPrompt,
} from "./tailorPrompt.ts";
import { ProfileVariant } from "../../types/ProfileVariant.ts";
import { buildProfileCatalog, saveVariant } from "./variant.ts";
import { getMasterProfile } from "./service.ts";
import {
  geminiModelName,
  GeneratedProfileVariant,
  getGenkitAi,
  profileVariantSchema,
  requireGeminiApiKey,
} from "./genkitClient.ts";
import { googleAI } from "@genkit-ai/google-genai";

function descriptionsToRecord(
  entries: GeneratedProfileVariant["experience_descriptions"],
): Record<string, string> | undefined {
  if (!entries?.length) return undefined;
  return Object.fromEntries(
    entries.map(({ id, description }) => [id, description]),
  );
}

function normalizeGeneratedVariant(
  generated: GeneratedProfileVariant,
  slug: string,
): ProfileVariant {
  return {
    slug,
    label: generated.label,
    target_role: generated.target_role,
    target_company: generated.target_company,
    summary: generated.summary,
    occupation: generated.occupation,
    experience_ids: generated.experience_ids,
    experience_descriptions: descriptionsToRecord(
      generated.experience_descriptions,
    ),
    project_ids: generated.project_ids,
    project_descriptions: descriptionsToRecord(generated.project_descriptions),
    skill_names: generated.skill_names,
  };
}

function validateVariant(
  data: ProfileVariant,
  slug: string,
  catalog: ReturnType<typeof buildProfileCatalog>,
): ProfileVariant {
  if (!data.label) throw new Error("Variant missing label");
  data.slug = slug;
  data.created_at = data.created_at ?? new Date().toISOString();

  const expIds = new Set(catalog.experiences.map((e) => e.id));
  const projIds = new Set(catalog.projects.map((p) => p.id));
  const skillNames = new Set(catalog.skills.map((s) => s.toLowerCase()));

  for (const id of data.experience_ids ?? []) {
    if (!expIds.has(id)) {
      throw new Error(`Unknown experience_id "${id}" in LLM output`);
    }
  }
  for (const id of data.project_ids ?? []) {
    if (!projIds.has(id)) {
      throw new Error(`Unknown project_id "${id}" in LLM output`);
    }
  }
  for (const name of data.skill_names ?? []) {
    if (!skillNames.has(name.trim().toLowerCase())) {
      throw new Error(`Unknown skill "${name}" in LLM output`);
    }
  }

  return data;
}

export async function generateVariant(
  slug: string,
  jobDescription: string,
): Promise<ProfileVariant> {
  requireGeminiApiKey();
  const catalog = buildProfileCatalog(getMasterProfile());
  const ai = getGenkitAi();

  const response = await ai.generate({
    model: googleAI.model(geminiModelName()),
    system: buildTailorSystemPrompt(),
    prompt: buildTailorUserPrompt(catalog, jobDescription, slug),
    output: { schema: profileVariantSchema },
    config: { temperature: 0.4 },
  });

  if (!response.output) {
    throw new Error("Gemini returned an empty structured response");
  }

  const variant = validateVariant(
    normalizeGeneratedVariant(response.output, slug),
    slug,
    catalog,
  );
  variant.job_description = jobDescription.trim();
  return variant;
}

/** @deprecated Use generateVariant */
export const generateVariantWithOpenAI = generateVariant;

export async function writeVariant(variant: ProfileVariant): Promise<string> {
  await saveVariant(variant);
  return `data/variants/${variant.slug}.json`;
}
