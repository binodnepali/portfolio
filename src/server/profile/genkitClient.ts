import { genkit, z } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

let ai: ReturnType<typeof genkit> | null = null;

export function getGenkitAi() {
  if (!ai) {
    const apiKey = Deno.env.get("GEMINI_API_KEY") ??
      Deno.env.get("GOOGLE_API_KEY");
    ai = genkit({
      plugins: [googleAI(apiKey ? { apiKey } : undefined)],
    });
  }
  return ai;
}

const descriptionEntrySchema = z.object({
  id: z.string().describe("Exact id from the profile catalog"),
  description: z.string().describe(
    "Bullet list; each line starts with '- '",
  ),
});

export const profileVariantSchema = z.object({
  label: z.string().describe(
    "Human-readable label, e.g. Acme — Senior Frontend Engineer",
  ),
  target_role: z.string().optional().describe("Role from the job posting"),
  target_company: z.string().optional().describe(
    "Company from the job posting",
  ),
  summary: z.string().optional().describe(
    "Two short paragraphs; keep {{year_of_experience}} when mentioning years",
  ),
  occupation: z.string().optional().describe(
    "CV headline, e.g. Frontend Software Engineer",
  ),
  experience_ids: z.array(z.string()).optional().describe(
    "Ordered experience ids from the catalog",
  ),
  experience_descriptions: z.array(descriptionEntrySchema).optional(),
  project_ids: z.array(z.string()).optional().describe(
    "Ordered project ids from the catalog",
  ),
  project_descriptions: z.array(descriptionEntrySchema).optional(),
  skill_names: z.array(z.string()).optional().describe(
    "Exact skill names from the catalog, in display order",
  ),
});

export type GeneratedProfileVariant = z.infer<typeof profileVariantSchema>;

export function geminiModelName(): string {
  return Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
}

export function requireGeminiApiKey(): string {
  const apiKey = Deno.env.get("GEMINI_API_KEY") ??
    Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Add it to your environment or .env file.",
    );
  }
  return apiKey;
}
