import { FreshContext } from "$fresh/server.ts";

import {
  buildCvWordDocument,
  cvExportFilename,
} from "../../../src/server/profile/exportDoc.ts";
import { getProfile } from "../../../src/server/profile/service.ts";

export const handler = (_req: Request, _ctx: FreshContext): Response => {
  const profile = getProfile();
  const body = buildCvWordDocument(profile);
  const filename = cvExportFilename(profile);

  return new Response(body, {
    headers: {
      "Content-Type": "application/msword; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
};
