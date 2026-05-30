import { Handlers } from "$fresh/server.ts";

import {
  deleteVariantsOlderThan,
  listVariantSummaries,
} from "../../../../src/server/profile/variantAdmin.ts";
import {
  authorizeTailorRequest,
  isTailorApiConfigured,
} from "../../../../src/server/profile/tailorAuth.ts";

function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

function unauthorized(): Response {
  return json({ error: "Unauthorized" }, 401);
}

function notConfigured(): Response {
  return json({
    error:
      "TAILOR_CV_API_KEY is not configured on the server (expected base64 text)",
  }, 503);
}

function requireAdmin(req: Request): Response | null {
  if (!isTailorApiConfigured()) return notConfigured();
  if (!authorizeTailorRequest(req)) return unauthorized();
  return null;
}

export const handler: Handlers = {
  async GET(req) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const variants = await listVariantSummaries();
    return json({ count: variants.length, variants });
  },

  async DELETE(req) {
    const denied = requireAdmin(req);
    if (denied) return denied;

    const url = new URL(req.url);
    const olderThanDays = Number(url.searchParams.get("olderThanDays"));
    if (!Number.isFinite(olderThanDays) || olderThanDays < 1) {
      return json({
        error:
          "Provide ?olderThanDays=<positive number>, e.g. ?olderThanDays=90",
      }, 400);
    }

    const dryRun = url.searchParams.get("dryRun") === "true";

    try {
      const { deleted, skipped } = await deleteVariantsOlderThan(
        olderThanDays,
        { dryRun },
      );
      return json({
        dry_run: dryRun,
        older_than_days: olderThanDays,
        deleted_count: deleted.length,
        deleted,
        skipped_without_created_at: skipped,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      return json({ error: message }, 400);
    }
  },
};
