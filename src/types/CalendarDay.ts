// A single scraped Bikram Sambat calendar day from hamropatro.com.
export interface CalendarDay {
  bsDay: string; // e.g. "१५"
  bsFullDate: string; // e.g. "१५ वैशाख २०८३, शुक्रवार"
  adFullDate: string; // e.g. "May 15, 2026"
  tithi: string;
  panchanga: string;
  event: string;
}
