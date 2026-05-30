import { FreshContext } from "$fresh/server.ts";

import {
  buildCoverLetterWordDocument,
  coverLetterExportFilename,
} from "../../../../../src/server/profile/exportDoc.ts";
import { getProfileForVariant } from "../../../../../src/server/profile/variant.ts";

export const handler = async (
  _req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const slug = ctx.params.slug;
  const result = await getProfileForVariant(slug);
  if (!result?.variant.cover_letter) {
    return Response.json({ error: "Cover letter not found" }, { status: 404 });
  }

  const body = buildCoverLetterWordDocument(result.profile, {
    salutation: result.variant.cover_letter_salutation,
    body: result.variant.cover_letter,
  });
  const filename = coverLetterExportFilename(
    result.profile,
    result.variant.target_company,
  );

  return new Response(body, {
    headers: {
      "Content-Type": "application/msword; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
};
