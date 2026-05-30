import { FreshContext } from "$fresh/server.ts";

import {
  buildCvWordDocument,
  cvExportFilename,
} from "../../../../src/server/profile/exportDoc.ts";
import { getProfileForVariant } from "../../../../src/server/profile/variant.ts";

export const handler = async (
  _req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const slug = ctx.params.slug;
  const result = await getProfileForVariant(slug);
  if (!result) {
    return Response.json({ error: "CV not found" }, { status: 404 });
  }

  const body = buildCvWordDocument(result.profile);
  const filename = cvExportFilename(result.profile);

  return new Response(body, {
    headers: {
      "Content-Type": "application/msword; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
};
