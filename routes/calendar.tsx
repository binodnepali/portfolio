import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";

import CalendarFeed from "../components/CalendarFeed.tsx";
import SiteFooter from "../components/SiteFooter.tsx";
import Navbar from "../islands/Navbar.tsx";
import { getSubscriptionIcs } from "../src/server/calendar/service.ts";
import {
  buildFeedLinks,
  buildYearLinks,
  CalendarPageData,
  FeedMeta,
} from "../src/server/calendar/feedView.ts";

import profile from "../data/linkedin-profile.json" with { type: "json" };

export const handler: Handlers<CalendarPageData | null> = {
  async GET(_req, ctx) {
    try {
      const { currentYear, nextYear, hasNext, eventCount } =
        await getSubscriptionIcs();
      const url = new URL(ctx.url);

      const meta: FeedMeta = {
        name: "Nepali Patro",
        currentYear,
        nextYear,
        hasNext,
        eventCount,
        generatedAt: new Date().toISOString(),
      };

      return ctx.render({
        meta,
        links: buildFeedLinks(url),
        years: buildYearLinks(url, currentYear, nextYear),
      });
    } catch (err) {
      console.error("Failed to load calendar page:", err);
      return ctx.render(null, { status: 500 });
    }
  },
};

export default function CalendarPage(
  { data: feed }: PageProps<CalendarPageData | null>,
) {
  return (
    <>
      <Head>
        <title>Nepali Patro — Calendar feed</title>
      </Head>

      <header>
        <Navbar
          github_profile_id={profile.extra.github_profile_id}
          linkedin_profile_id={profile.extra.linkedin_profile_id}
          email={profile.email}
        />
      </header>

      <main class="container mx-auto px-4 py-8">
        <div class="flex flex-col items-center">
          <div class="w-full md:w-3/5">
            {feed ? <CalendarFeed {...feed} /> : (
              <div class="text-center py-12">
                <p class="mb-4">
                  Failed to load calendar feed. Please try again later.
                </p>
                <a href="/" class="text-teal-500 underline">Back home</a>
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
