import { BirthDate } from "../types/Profile.ts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatMonthYear(date: BirthDate | null): string {
  if (!date) return "Present";
  const month = MONTHS[date.month - 1] ?? "";
  return `${month} ${date.year}`.trim();
}

export function formatYearRange(
  starts_at: BirthDate,
  ends_at: BirthDate | null,
): string {
  const end = ends_at ? `${ends_at.year}` : "Present";
  if (ends_at && starts_at.year === ends_at.year) return `${starts_at.year}`;
  return `${starts_at.year} – ${end}`;
}

export function formatDuration(
  start: BirthDate,
  end: BirthDate | null,
): string {
  const startDate = new Date(start.year, start.month - 1, 1);
  const endDate = end ? new Date(end.year, end.month - 1, 1) : new Date();

  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  months = Math.max(months, 0) + 1; // inclusive of the starting month

  const years = Math.floor(months / 12);
  const rest = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (rest > 0) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);
  return parts.join(" ") || "1 mo";
}
