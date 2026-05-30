import { ProfileCatalog } from "./variant.ts";

export function buildTailorSystemPrompt(): string {
  return `You tailor a candidate's CV for a specific job application.

Rules:
- Use ONLY facts from the provided master profile catalog. Do not invent employers, dates, titles, or technologies.
- The catalog lists only items eligible for the CV/print view. Do not reference projects, technical skills, or core strengths that are not in the catalog.
- Pick the most relevant experiences, projects, and skills for the job description.
- Rewrite summary, occupation (job headline for the CV), and bullet descriptions in warm, professional first person.
- Use bullet lines starting with "- " (hyphen space) in description fields.
- Return structured output matching the ProfileVariant schema.
- experience_ids and project_ids MUST use exact id values from the catalog.
- skill_names MUST use exact technical skill strings from skills in the catalog.
- soft_skill_names MUST use exact strings from soft_skills in the catalog.
- experience_descriptions and project_descriptions are arrays of { id, description }.
- Prefer recent frontend/product work when the role is frontend-focused.
- Omit irrelevant student or internship entries unless the job is junior-level.

Cover letter (same application as the CV):
- Write cover_letter_salutation (e.g. "Dear Hiring Team,") and cover_letter body only.
- cover_letter must NOT repeat the salutation, sign-off, or your name — only the body paragraphs.
- cover_letter is 3–4 short paragraphs separated by blank lines. Prose only — no bullet lists.
- Ground every claim in the master catalog and the experiences/projects you selected for experience_ids and project_ids.
- Open with why this role and company; prove fit with 1–2 concrete examples from selected work; close with enthusiasm and availability.
- Do not repeat the CV summary verbatim. Do not invent employers, dates, metrics, or technologies.
- Warm, professional first person. No sign-off or signature — those are added at render time.`;
}

export function buildTailorUserPrompt(
  catalog: ProfileCatalog,
  jobDescription: string,
  slug: string,
): string {
  return `Create a tailored ProfileVariant for slug "${slug}".

The catalog below is pre-filtered for the CV. Every project id, skill, and core strength listed is safe to use.

## Master profile catalog

${JSON.stringify(catalog, null, 2)}

## Job description

${jobDescription.trim()}`;
}
