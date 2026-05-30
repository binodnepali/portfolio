import { Handlers } from "$fresh/server.ts";

import { generateVariant } from "../../../src/server/profile/tailorLlm.ts";
import { saveVariant } from "../../../src/server/profile/variant.ts";
import {
  authorizeTailorRequest,
  isTailorApiConfigured,
} from "../../../src/server/profile/tailorAuth.ts";
import { requireGeminiApiKey } from "../../../src/server/profile/geminiConfig.ts";
import {
  readJobFile,
  resolveTailorSlug,
} from "../../../src/server/profile/tailorUpload.ts";

interface TailorSuccess {
  slug: string;
  label: string;
  previewUrl: string;
  storedInKv: boolean;
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export const handler: Handlers = {
  async POST(req) {
    if (!isTailorApiConfigured()) {
      return json({
        error: "TAILOR_CV_API_KEY is not configured on the server (expected base64 text)",
      }, 503);
    }
    if (!authorizeTailorRequest(req)) {
      return json({ error: "Unauthorized" }, 401);
    }

    try {
      requireGeminiApiKey();
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : "Gemini is not configured";
      return json({ error: message }, 503);
    }

    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.includes("multipart/form-data")) {
      return json({ error: "Expected multipart/form-data" }, 400);
    }

    let form: FormData;
    try {
      form = await req.formData();
    } catch {
      return json({ error: "Invalid form data" }, 400);
    }

    const file = form.get("file");
    if (!(file instanceof File)) {
      return json(
        { error: 'Missing "file" (.txt or .md job description)' },
        400,
      );
    }

    try {
      const jobDescription = await readJobFile(file);
      const slug = resolveTailorSlug(form.get("slug"), file.name);
      const variant = await generateVariant(slug, jobDescription);
      const stored = await saveVariant(variant);
      if (!stored.kv && !stored.file) {
        return json(
          { error: "Variant generated but could not be persisted" },
          500,
        );
      }

      const body: TailorSuccess = {
        slug: variant.slug,
        label: variant.label,
        previewUrl: `/cv/${variant.slug}`,
        storedInKv: stored.kv,
      };
      return json(body, 201);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      const status = message.includes("too large") ||
          message.includes("Upload a") ||
          message.includes("empty")
        ? 400
        : 500;
      return json({ error: message }, status);
    }
  },
};
