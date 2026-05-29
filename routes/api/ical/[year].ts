import { FreshContext } from "$fresh/server.ts";

import {
  getIcsForYear,
  MAX_YEAR,
  MIN_YEAR,
} from "../../../src/server/calendar/service.ts";

export const handler = async (
  _req: Request,
  ctx: FreshContext,
): Promise<Response> => {
  const year = Number(ctx.params.year);

  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return new Response(
      JSON.stringify({
        error: `Year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const ics = await getIcsForYear(year);

    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition":
          `attachment; filename="nepali-calendar-${year}.ics"`,
      },
    });
  } catch (err) {
    console.error(`Failed to build calendar for ${year}:`, err);
    return new Response(
      JSON.stringify({ error: "Failed to generate calendar" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
