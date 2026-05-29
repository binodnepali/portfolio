// Scrapes Nepali calendar data (Bikram Sambat) from hamropatro.com.
// Ported from the Node/Puppeteer scraper to plain fetch + deno-dom, since
// hamropatro serves the calendar grid in server-rendered HTML (no JS needed)
// and Deno Deploy cannot run a headless browser.

import { DOMParser, type Element } from "deno_dom";

import { CalendarDay } from "../../types/CalendarDay.ts";

const MONTHS_PER_YEAR = 12;
const BASE_URL = "https://www.hamropatro.com/calendar";
// A browser-like UA avoids being served a stripped-down/blocked response.
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

// Convert a string containing Devanagari (or ASCII) digits into an integer.
// e.g. "२०८३" -> 2083. Returns null if no digits are present.
function parseNepaliDigits(str: string): number | null {
  let out = "";
  for (const ch of str) {
    const devIdx = DEVANAGARI_DIGITS.indexOf(ch);
    if (devIdx >= 0) out += String(devIdx);
    else if (ch >= "0" && ch <= "9") out += ch;
  }
  return out ? parseInt(out, 10) : null;
}

// deno-dom exposes textContent (not innerText) and does not convert <br> to
// whitespace, so collapse all runs of whitespace into single spaces.
function cleanText(el: Element | null): string {
  if (!el) return "";
  return (el.textContent ?? "").replace(/\s+/g, " ").trim();
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

function parseDays(html: string): CalendarDay[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return [];

  const dateElements = doc.querySelectorAll("#calendarContainer .dates li");
  const days: CalendarDay[] = [];

  dateElements.forEach((node) => {
    const el = node as unknown as Element;

    // Filter out disabled dates from adjacent months so we don't duplicate.
    if (el.classList.contains("disable")) return;

    const bsDay = cleanText(el.querySelector(".nep"));
    const tithi = cleanText(el.querySelector(".tithi"));
    const rawEvent = cleanText(el.querySelector(".event"));

    const modalWrapper = el.querySelector(".daydetailsPopOver");
    let bsFullDate = "";
    let adFullDate = "";
    let panchanga = "";

    if (modalWrapper) {
      bsFullDate = cleanText(modalWrapper.querySelector(".col1 span"));
      adFullDate = cleanText(modalWrapper.querySelector(".col2"));
      panchanga = cleanText(modalWrapper.querySelector(".panchangaWrapper"));
    }

    const event = rawEvent === "--" ? "" : rawEvent;

    days.push({ bsDay, bsFullDate, adFullDate, tithi, panchanga, event });
  });

  return days;
}

export async function scrapeMonth(
  year: number,
  month: number,
): Promise<CalendarDay[]> {
  const html = await fetchHtml(`${BASE_URL}/${year}/${month}`);
  return parseDays(html);
}

export async function scrapeYear(year: number): Promise<CalendarDay[]> {
  const allDays: CalendarDay[] = [];

  // Sequential month-by-month scraping for reliability over speed.
  for (let month = 1; month <= MONTHS_PER_YEAR; month++) {
    const monthData = await scrapeMonth(year, month);
    allDays.push(...monthData);
  }

  return allDays;
}

// Resolves the current Bikram Sambat year by reading hamropatro's default
// calendar page (which always renders the current month/year). Used by the
// stable subscription endpoint so users never have to pass a year.
export async function getCurrentBsYear(): Promise<number | null> {
  const html = await fetchHtml(BASE_URL);
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) return null;

  // Each full-date string looks like "१ जेठ २०८३, शुक्रवार"; the year is the
  // 3rd token. Pick the most frequent year to be robust against
  // month-boundary dates from adjacent months.
  const counts = new Map<number, number>();

  doc.querySelectorAll("#calendarContainer .dates li").forEach((node) => {
    const el = node as unknown as Element;
    if (el.classList.contains("disable")) return;

    const fullDate = cleanText(
      el.querySelector(".daydetailsPopOver .col1 span"),
    );
    const yearToken = fullDate.split(" ")[2] ?? "";
    const year = parseNepaliDigits(yearToken.replace(/,/g, ""));
    if (year) counts.set(year, (counts.get(year) ?? 0) + 1);
  });

  let bestYear: number | null = null;
  let bestCount = -1;
  for (const [year, count] of counts) {
    if (count > bestCount) {
      bestYear = year;
      bestCount = count;
    }
  }

  return bestYear;
}
