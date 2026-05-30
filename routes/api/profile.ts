import { FreshContext } from "$fresh/server.ts";

import { getProfile } from "../../src/server/profile/service.ts";

export const handler = (_req: Request, _ctx: FreshContext): Response => {
  return Response.json(getProfile());
};
