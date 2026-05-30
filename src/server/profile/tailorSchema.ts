import { ProfileVariant } from "../../types/ProfileVariant.ts";
import { buildProfileCatalog } from "./variant.ts";

const descriptionEntrySchema = {
  type: "object",
  properties: {
    id: { type: "string", description: "Exact id from the profile catalog" },
    description: {
      type: "string",
      description: "Bullet list; each line starts with '- '",
    },
  },
  required: ["id", "description"],
} as const;

export const geminiVariantJsonSchema = {
  type: "object",
  properties: {
    label: {
      type: "string",
      description: "Human-readable label, e.g. Acme — Senior Frontend Engineer",
    },
    target_role: { type: "string", description: "Role from the job posting" },
    target_company: {
      type: "string",
      description: "Company from the job posting",
    },
    summary: {
      type: "string",
      description:
        "Two short paragraphs; keep {{year_of_experience}} when mentioning years",
    },
    occupation: {
      type: "string",
      description: "CV headline, e.g. Frontend Software Engineer",
    },
    experience_ids: {
      type: "array",
      items: { type: "string" },
      description: "Ordered experience ids from the catalog",
    },
    experience_descriptions: {
      type: "array",
      items: descriptionEntrySchema,
    },
    project_ids: {
      type: "array",
      items: { type: "string" },
      description: "Ordered project ids from the catalog",
    },
    project_descriptions: {
      type: "array",
      items: descriptionEntrySchema,
    },
    skill_names: {
      type: "array",
      items: { type: "string" },
      description:
        "Exact technical skill names from the catalog, in display order",
    },
    soft_skill_names: {
      type: "array",
      items: { type: "string" },
      description: "Exact core strength names from soft_skills in the catalog",
    },
  },
  required: ["label"],
} as const;

export interface GeneratedProfileVariant {
  label: string;
  target_role?: string;
  target_company?: string;
  summary?: string;
  occupation?: string;
  experience_ids?: string[];
  experience_descriptions?: Array<{ id: string; description: string }>;
  project_ids?: string[];
  project_descriptions?: Array<{ id: string; description: string }>;
  skill_names?: string[];
  soft_skill_names?: string[];
}

function descriptionsToRecord(
  entries: GeneratedProfileVariant["experience_descriptions"],
): Record<string, string> | undefined {
  if (!entries?.length) return undefined;
  return Object.fromEntries(
    entries.map(({ id, description }) => [id, description]),
  );
}

export function normalizeGeneratedVariant(
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
    project_descriptions: descriptionsToRecord(
      generated.project_descriptions,
    ),
    skill_names: generated.skill_names,
    soft_skill_names: generated.soft_skill_names,
  };
}

export function validateVariant(
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
  const softSkillNames = new Set(
    catalog.soft_skills.map((s) => s.toLowerCase()),
  );

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
  for (const name of data.soft_skill_names ?? []) {
    if (!softSkillNames.has(name.trim().toLowerCase())) {
      throw new Error(`Unknown soft skill "${name}" in LLM output`);
    }
  }

  return data;
}
