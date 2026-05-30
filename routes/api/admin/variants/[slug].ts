import { Handlers } from "$fresh/server.ts";

import {
  deleteVariantEverywhere,
  variantExists,
} from "../../../../src/server/profile/variantAdmin.ts";
import {
  authorizeTailorRequest,
  isTailorApiConfigured,
} from "../../../../src/server/profile/tailorAuth.ts";

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export const handler: Handlers = {
  async DELETE(_req, ctx) {
    if (!isTailorApiConfigured()) {
      return json({
        error:
          "TAILOR_CV_API_KEY is not configured on the server (expected base64 text)",
      }, 503);
    }
    if (!authorizeTailorRequest(_req)) {
      return json({ error: "Unauthorized" }, 401);
    }

    const slug = ctx.params.slug?.trim();
    if (!slug) {
      return json({ error: "Missing variant slug" }, 400);
    }

    if (!(await variantExists(slug))) {
      return json({ error: "Variant not found" }, 404);
    }

    const removed = await deleteVariantEverywhere(slug);
    if (!removed.kv && !removed.file) {
      return json({ error: "Variant not found" }, 404);
    }

    return json({ slug, removed });
  },
};
