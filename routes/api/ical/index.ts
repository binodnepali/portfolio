import { FreshContext } from "$fresh/server.ts";

import { getSubscriptionIcs } from "../../../src/server/calendar/service.ts";

// Stable subscription endpoint: no year needed. Serves the current Nepali year
// plus the next year as one continuous feed and rolls over automatically at
// Nepali new year, so a subscriber never has to change the URL.
export const handler = async (
  _req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  try {
    const { ics, currentYear, nextYear, hasNext } = await getSubscriptionIcs();
    const label = hasNext ? `${currentYear}-${nextYear}` : `${currentYear}`;

    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition":
          `attachment; filename="nepali-calendar-${label}.ics"`,
      },
    });
  } catch (err) {
    console.error("Failed to build subscription calendar:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate calendar" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
