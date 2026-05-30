import {
  buildTailorSystemPrompt,
  buildTailorUserPrompt,
} from "./tailorPrompt.ts";
import { ProfileVariant } from "../../types/ProfileVariant.ts";
import { buildProfileCatalog } from "./variant.ts";
import { getMasterProfile } from "./service.ts";
import { geminiModelName, requireGeminiApiKey } from "./geminiConfig.ts";
import {
  geminiVariantJsonSchema,
  GeneratedProfileVariant,
  normalizeGeneratedVariant,
  validateVariant,
} from "./tailorSchema.ts";

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
}

export async function generateVariantWithGemini(
  slug: string,
  jobDescription: string,
): Promise<ProfileVariant> {
  const apiKey = requireGeminiApiKey();
  const catalog = buildProfileCatalog(getMasterProfile());
  const model = geminiModelName();

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${
      encodeURIComponent(apiKey)
    }`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: buildTailorSystemPrompt() }],
        },
        contents: [{
          role: "user",
          parts: [{
            text: buildTailorUserPrompt(catalog, jobDescription, slug),
          }],
        }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
          responseSchema: geminiVariantJsonSchema,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${body}`);
  }

  const payload = await response.json() as GeminiGenerateResponse;
  if (payload.error?.message) {
    throw new Error(`Gemini API error: ${payload.error.message}`);
  }

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response");

  let generated: GeneratedProfileVariant;
  try {
    generated = JSON.parse(text) as GeneratedProfileVariant;
  } catch {
    throw new Error("Gemini returned invalid JSON");
  }

  const variant = validateVariant(
    normalizeGeneratedVariant(generated, slug),
    slug,
    catalog,
  );
  variant.job_description = jobDescription.trim();
  return variant;
}
