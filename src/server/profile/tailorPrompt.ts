import { ProfileCatalog } from "./variant.ts";

export function buildTailorSystemPrompt(): string {
  return `You tailor a candidate's CV for a specific job application.

Rules:
- Use ONLY facts from the provided master profile catalog. Do not invent employers, dates, titles, or technologies.
- Pick the most relevant experiences, projects, and skills for the job description.
- Rewrite summary, occupation (job headline for the CV), and bullet descriptions in warm, professional first person.
- Use bullet lines starting with "- " (hyphen space) in description fields.
- Return structured output matching the ProfileVariant schema.
- experience_ids and project_ids MUST use exact id values from the catalog.
- skill_names MUST use exact technical skill strings from skills in the catalog.
- soft_skill_names MUST use exact strings from soft_skills in the catalog.
- experience_descriptions and project_descriptions are arrays of { id, description }.
- Prefer recent frontend/product work when the role is frontend-focused.
- Omit irrelevant student or internship entries unless the job is junior-level.`;
}

export function buildTailorUserPrompt(
  catalog: ProfileCatalog,
  jobDescription: string,
  slug: string,
): string {
  return `Create a tailored ProfileVariant for slug "${slug}".

## Master profile catalog

${JSON.stringify(catalog, null, 2)}

## Job description

${jobDescription.trim()}`;
}
