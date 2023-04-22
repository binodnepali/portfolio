import { HandlerContext } from "$fresh/server.ts";

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const body = {
    name: "Binod Nepali",
    email: "nepalbinod9@gmail.com",
  };

  return new Response(JSON.stringify(body));
};
