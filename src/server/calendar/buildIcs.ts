// Builds an ICS (RFC 5545) calendar string from scraped Nepali date data.
// Title/description logic mirrors the original Node implementation.
//
// All-day events use DTSTART;VALUE=DATE:YYYYMMDD. This is the correct ICS
// representation for an all-day event and inherently avoids the timezone
// off-by-one shift (no UTC-midnight workaround needed).

import { CalendarDay } from "../../types/CalendarDay.ts";

const PRODID = "-//binodnepali//Nepali Patro//EN";

// Convert a Gregorian date string "May 10, 2026" into a YYYYMMDD string.
// `new Date("May 10, 2026")` is parsed at LOCAL midnight, so the local date
// components are the intended calendar date; reading UTC components would
// shift the day in positive-offset timezones. Combined with DTSTART;VALUE=DATE
// (a floating, timezone-less date), the calendar day is preserved everywhere.
function toIcsDate(adString: string): string | null {
  const cleanStr = adString.replace(/,/g, " ").replace(/\s+/g, " ").trim();
  const parsed = new Date(cleanStr);
  if (isNaN(parsed.getTime())) return null;

  const y = parsed.getFullYear();
  const m = String(parsed.getMonth() + 1).padStart(2, "0");
  const d = String(parsed.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

// Escape a value per RFC 5545: backslash, semicolon, comma, and newlines.
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r\n|\n|\r/g, "\\n");
}

// Fold a content line to <=75 octets per RFC 5545, splitting on UTF-8
// character boundaries so multibyte Devanagari text is never broken mid-byte.
// Continuation lines start with a single space.
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const bytes = encoder.encode(line);
  if (bytes.length <= 75) return line;

  const chunks: string[] = [];
  let start = 0;
  let isFirst = true;
  while (start < bytes.length) {
    // First line: 75 octets. Continuation lines: 74 (1 octet for leading space).
    const limit = isFirst ? 75 : 74;
    let end = Math.min(start + limit, bytes.length);
    // Back off to a UTF-8 character boundary (continuation bytes are 0b10xxxxxx).
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) {
      end--;
    }
    const chunk = decoder.decode(bytes.subarray(start, end));
    chunks.push(isFirst ? chunk : ` ${chunk}`);
    start = end;
    isFirst = false;
  }
  return chunks.join("\r\n");
}

function nowStamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
}

export function buildCalendar(
  name: string,
  days: CalendarDay[],
): { ics: string; eventCount: number } {
  const dtstamp = nowStamp();
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(name)}`,
  ];

  let eventCount = 0;

  for (const day of days) {
    const date = toIcsDate(day.adFullDate);
    if (!date) continue;

    // Month name is the 2nd token of "१५ वैशाख २०८३, शुक्रवार".
    const monthName = day.bsFullDate.split(" ")[1]?.replace(",", "") ?? "";
    const summary = `${day.bsDay} ${monthName}`.trim();

    let description = `Full Date: ${day.bsFullDate}\nTithi: ${day.tithi}`;
    if (day.event) description += `\nEvent: ${day.event}`;
    if (day.panchanga) description += `\n\nPanchanga:\n${day.panchanga}`;

    lines.push(
      "BEGIN:VEVENT",
      `UID:${date}@binodnepali`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;VALUE=DATE:${date}`,
      `SUMMARY:${escapeText(summary)}`,
      `DESCRIPTION:${escapeText(description)}`,
      "TRANSP:TRANSPARENT",
      "END:VEVENT",
    );

    eventCount++;
  }

  lines.push("END:VCALENDAR");

  const ics = lines.map(foldLine).join("\r\n") + "\r\n";
  return { ics, eventCount };
}
