import { FreshContext } from "$fresh/server.ts";

import { getSubscriptionIcs } from "../../../src/server/calendar/service.ts";
import {
  buildFeedJson,
  buildFeedLinks,
  buildYearLinks,
  calendarPageUrl,
  FeedMeta,
  negotiateFeedFormat,
  shouldRedirectBrowserToCalendar,
} from "../../../src/server/calendar/feedView.ts";

// Stable subscription endpoint: no year needed. Serves the current Nepali year
// plus the next year as one continuous feed and rolls over automatically at
// Nepali new year, so a subscriber never has to change the URL.
//
// Calendar clients get ICS (default); `?format=json` returns structured data.
// Browsers without an explicit format are redirected to /calendar.
export const handler = async (
  req: Request,
  _ctx: FreshContext,
): Promise<Response> => {
  const url = new URL(req.url);

  if (shouldRedirectBrowserToCalendar(req, url)) {
    return Response.redirect(calendarPageUrl(url), 302);
  }

  const format = negotiateFeedFormat(req, url);

  try {
    const { ics, currentYear, nextYear, hasNext, eventCount } =
      await getSubscriptionIcs();

    if (format === "ics") {
      const label = hasNext ? `${currentYear}-${nextYear}` : `${currentYear}`;
      return new Response(ics, {
        headers: {
          "Content-Type": "text/calendar; charset=utf-8",
          "Content-Disposition":
            `attachment; filename="nepali-calendar-${label}.ics"`,
        },
      });
    }

    const meta: FeedMeta = {
      name: "Nepali Patro",
      currentYear,
      nextYear,
      hasNext,
      eventCount,
      generatedAt: new Date().toISOString(),
    };
    const links = buildFeedLinks(url);
    const years = buildYearLinks(url, currentYear, nextYear);

    return Response.json(buildFeedJson(meta, links, years));
  } catch (err) {
    console.error("Failed to build subscription calendar:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate calendar" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
