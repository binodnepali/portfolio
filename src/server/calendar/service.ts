// Orchestrates scraping, caching and ICS building for the calendar feeds.
// Ported from the Node/Express server, swapping the in-memory Map cache for
// Deno KV so scraped data persists across (ephemeral) Deno Deploy isolates.

import { CalendarDay } from "../../types/CalendarDay.ts";
import { getCurrentBsYear, scrapeMonth } from "./scrape.ts";
import { buildCalendar } from "./buildIcs.ts";

const MONTHS_PER_YEAR = 12;

const DAYS_TTL_MS = 24 * 60 * 60 * 1000; // 24h
// Re-check the current Nepali year a few times a day so the subscription
// endpoint rolls over automatically around Nepali new year (mid-April).
const CURRENT_YEAR_TTL_MS = 6 * 60 * 60 * 1000; // 6h

export const MIN_YEAR = 1970;
export const MAX_YEAR = 2200;

let kvPromise: Promise<Deno.Kv> | null = null;
function getKv(): Promise<Deno.Kv> {
  if (!kvPromise) kvPromise = Deno.openKv();
  return kvPromise;
}

// Dedupe concurrent scrapes for the same month within a single isolate.
const inFlight = new Map<string, Promise<CalendarDay[]>>();

// Caching is done per month rather than per year: a full year of days with
// panchanga text exceeds Deno KV's 64KB per-value limit, whereas a single
// month comfortably fits. Both the single-year and subscription feeds reuse
// the same per-month scrapes.
async function getDaysForMonth(
  year: number,
  month: number,
): Promise<CalendarDay[]> {
  const kv = await getKv();
  const key = ["calendar", "days", year, month];

  const cached = await kv.get<CalendarDay[]>(key);
  if (cached.value && cached.value.length > 0) {
    return cached.value;
  }

  const inFlightKey = `${year}-${month}`;
  const existing = inFlight.get(inFlightKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const days = await scrapeMonth(year, month);
      // Only cache non-empty results so a transient/empty scrape is retried.
      if (days.length > 0) {
        try {
          await kv.set(key, days, { expireIn: DAYS_TTL_MS });
        } catch (err) {
          // Never let a cache-write failure (e.g. an unexpectedly large
          // value) break the response; just serve the freshly scraped data.
          console.warn(`Skipped caching ${year}/${month}:`, err);
        }
      }
      return days;
    } finally {
      inFlight.delete(inFlightKey);
    }
  })();

  inFlight.set(inFlightKey, promise);
  return promise;
}

export async function getDaysForYear(year: number): Promise<CalendarDay[]> {
  const allDays: CalendarDay[] = [];
  for (let month = 1; month <= MONTHS_PER_YEAR; month++) {
    const monthData = await getDaysForMonth(year, month);
    allDays.push(...monthData);
  }
  return allDays;
}

export async function getCurrentYear(): Promise<number> {
  const kv = await getKv();
  const key = ["calendar", "currentYear"];

  const cached = await kv.get<number>(key);
  if (cached.value) return cached.value;

  const year = await getCurrentBsYear();
  if (!year) {
    throw new Error("Could not determine the current Nepali year");
  }

  await kv.set(key, year, { expireIn: CURRENT_YEAR_TTL_MS });
  return year;
}

export async function getIcsForYear(year: number): Promise<string> {
  const days = await getDaysForYear(year);
  const { ics, eventCount } = buildCalendar(`Nepali Patro ${year}`, days);

  if (eventCount === 0) {
    throw new Error(`No calendar data found for year ${year}`);
  }

  return ics;
}

export interface SubscriptionFeed {
  ics: string;
  currentYear: number;
  nextYear: number;
  hasNext: boolean;
}

// Builds the stable subscription feed: the current Nepali year plus the next
// year so the calendar stays continuous across the new-year boundary. The next
// year is best-effort; if it isn't available yet we serve the current year only.
export async function getSubscriptionIcs(): Promise<SubscriptionFeed> {
  const currentYear = await getCurrentYear();
  const nextYear = currentYear + 1;

  const currentDays = await getDaysForYear(currentYear);

  let nextDays: CalendarDay[] = [];
  try {
    nextDays = await getDaysForYear(nextYear);
  } catch (err) {
    console.warn(
      `Next year ${nextYear} unavailable, serving ${currentYear} only:`,
      err instanceof Error ? err.message : err,
    );
  }

  const allDays = [...currentDays, ...nextDays];
  const { ics, eventCount } = buildCalendar("Nepali Patro", allDays);

  if (eventCount === 0) {
    throw new Error("No calendar data found for the current year");
  }

  return { ics, currentYear, nextYear, hasNext: nextDays.length > 0 };
}
