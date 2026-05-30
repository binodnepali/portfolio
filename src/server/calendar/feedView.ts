// Link builders and JSON shape for the Nepali calendar subscription feed.
// Human-facing UI lives at /calendar; the machine feed is /api/ical.

import { MAX_YEAR, MIN_YEAR } from "./service.ts";

export const ICAL_FEED_PATH = "/api/ical";

export type FeedFormat = "ics" | "json";

// Number of past years (relative to the current Nepali year) to offer as
// single-year downloads, alongside the current and next year.
const PAST_YEARS_SHOWN = 2;

export function publicSiteOrigin(url: URL): string {
  const fromEnv = Deno.env.get("SITE_ORIGIN")?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  return url.origin;
}

function publicSiteHost(url: URL): string {
  try {
    return new URL(publicSiteOrigin(url)).host;
  } catch {
    return url.host;
  }
}

function feedBaseUrl(url: URL): string {
  return `${publicSiteOrigin(url)}${ICAL_FEED_PATH}`;
}

// Decide what to serve from /api/ical. Explicit `?format=` wins; otherwise
// calendar clients get ICS and JSON clients get JSON.
export function negotiateFeedFormat(req: Request, url: URL): FeedFormat {
  const fmt = url.searchParams.get("format")?.toLowerCase();
  if (fmt === "json") return "json";
  if (fmt === "ics" || fmt === "ical") return "ics";
  const accept = req.headers.get("accept") ?? "";
  if (accept.includes("application/json")) return "json";
  return "ics";
}

export function shouldRedirectBrowserToCalendar(
  req: Request,
  url: URL,
): boolean {
  if (url.searchParams.has("format")) return false;
  const accept = req.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

export function calendarPageUrl(url: URL): string {
  return `${publicSiteOrigin(url)}/calendar`;
}

export interface FeedLinks {
  subscribeUrl: string;
  webcalUrl: string;
  downloadUrl: string;
}

export interface YearLink {
  year: number;
  url: string;
}

export function buildFeedLinks(url: URL): FeedLinks {
  const base = feedBaseUrl(url);
  return {
    subscribeUrl: base,
    webcalUrl: `webcal://${publicSiteHost(url)}${ICAL_FEED_PATH}`,
    downloadUrl: base,
  };
}

export function buildYearLinks(
  url: URL,
  currentYear: number,
  nextYear: number,
): YearLink[] {
  const origin = publicSiteOrigin(url);
  const from = Math.max(MIN_YEAR, currentYear - PAST_YEARS_SHOWN);
  const to = Math.min(MAX_YEAR, nextYear);
  const links: YearLink[] = [];
  for (let year = to; year >= from; year--) {
    links.push({ year, url: `${origin}${ICAL_FEED_PATH}/${year}` });
  }
  return links;
}

export interface FeedMeta {
  name: string;
  currentYear: number;
  nextYear: number;
  hasNext: boolean;
  eventCount: number;
  generatedAt: string;
}

export interface FeedJson {
  feed: FeedMeta & FeedLinks & { coversYears: number[] };
  years: YearLink[];
}

export function buildFeedJson(
  meta: FeedMeta,
  links: FeedLinks,
  years: YearLink[],
): FeedJson {
  const coversYears = meta.hasNext
    ? [meta.currentYear, meta.nextYear]
    : [meta.currentYear];
  return {
    feed: { ...meta, ...links, coversYears },
    years,
  };
}

export interface CalendarPageData {
  meta: FeedMeta;
  links: FeedLinks;
  years: YearLink[];
}
