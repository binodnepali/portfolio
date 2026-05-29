// Orchestrates scraping, caching and ICS building for the calendar feeds.
// Ported from the Node/Express server, using Deno KV so scraped data persists
// across (ephemeral) Deno Deploy isolates, with a per-isolate in-memory
// fallback for runtimes where the (unstable) KV API is unavailable.

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

// --- Cache layer -----------------------------------------------------------
// Prefer Deno KV (shared across isolates). If the runtime doesn't expose the
// KV API, transparently fall back to a per-isolate in-memory TTL store so the
// endpoints still work (just without cross-isolate persistence).

let kvPromise: Promise<Deno.Kv | null> | null = null;
function getKv(): Promise<Deno.Kv | null> {
  if (!kvPromise) {
    kvPromise = (async () => {
      if (typeof Deno.openKv !== "function") {
        console.warn("Deno KV unavailable; using in-memory cache fallback.");
        return null;
      }
      try {
        return await Deno.openKv();
      } catch (err) {
        console.warn("Failed to open Deno KV; using in-memory fallback:", err);
        return null;
      }
    })();
  }
  return kvPromise;
}

const memCache = new Map<string, { value: unknown; expiresAt: number }>();

async function cacheGet<T>(key: (string | number)[]): Promise<T | null> {
  const kv = await getKv();
  if (kv) {
    const res = await kv.get<T>(key);
    return res.value ?? null;
  }
  const entry = memCache.get(JSON.stringify(key));
  if (entry && entry.expiresAt > Date.now()) return entry.value as T;
  return null;
}

async function cacheSet<T>(
  key: (string | number)[],
  value: T,
  ttlMs: number,
): Promise<void> {
  const kv = await getKv();
  if (kv) {
    try {
      await kv.set(key, value, { expireIn: ttlMs });
    } catch (err) {
      // Never let a cache-write failure (e.g. an unexpectedly large value)
      // break the response; just serve the freshly scraped data.
      console.warn(`Skipped caching ${JSON.stringify(key)}:`, err);
    }
    return;
  }
  memCache.set(JSON.stringify(key), {
    value,
    expiresAt: Date.now() + ttlMs,
  });
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
  const key = ["calendar", "days", year, month];

  const cached = await cacheGet<CalendarDay[]>(key);
  if (cached && cached.length > 0) {
    return cached;
  }

  const inFlightKey = `${year}-${month}`;
  const existing = inFlight.get(inFlightKey);
  if (existing) return existing;

  const promise = (async () => {
    try {
      const days = await scrapeMonth(year, month);
      // Only cache non-empty results so a transient/empty scrape is retried.
      if (days.length > 0) {
        await cacheSet(key, days, DAYS_TTL_MS);
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
  const key = ["calendar", "currentYear"];

  const cached = await cacheGet<number>(key);
  if (cached) return cached;

  const year = await getCurrentBsYear();
  if (!year) {
    throw new Error("Could not determine the current Nepali year");
  }

  await cacheSet(key, year, CURRENT_YEAR_TTL_MS);
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
