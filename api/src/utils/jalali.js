/**
 * Jalali (Shamsi) date helpers built on Intl (no extra dependency).
 * Dates are stored in UTC and always shown in Iran time.
 */
const TIME_ZONE = 'Asia/Tehran';

const dateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const pad2 = (value) => String(value).padStart(2, '0');

function getJalaliParts(date) {
  const parts = dateFormatter.formatToParts(date);
  const pick = (type) => Number(parts.find((part) => part.type === type).value);
  return { year: pick('year'), month: pick('month'), day: pick('day') };
}

/** 1405/4/12 */
export function formatJalaliDate(date) {
  const { year, month, day } = getJalaliParts(date);
  return `${year}/${month}/${day}`;
}

/** 14050412 (used inside tracking codes) */
export function formatJalaliCompact(date) {
  const { year, month, day } = getJalaliParts(date);
  return `${year}${pad2(month)}${pad2(day)}`;
}

/** 14:35 (24h, Iran time) */
export const formatTehranTime = (date) => timeFormatter.format(date);

// ---------------------------------------------------------------------------
// Date-only values (DATE columns: deadlines, due dates).
// They have no time zone, so they travel as 'YYYY-MM-DD' strings and are
// formatted at UTC noon to avoid any day shift.
// ---------------------------------------------------------------------------

const utcDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', {
  timeZone: 'UTC',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const todayFormatter = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }); // YYYY-MM-DD

function getJalaliPartsUtc(date) {
  const parts = utcDateFormatter.formatToParts(date);
  const pick = (type) => Number(parts.find((part) => part.type === type).value);
  return { year: pick('year'), month: pick('month'), day: pick('day') };
}

// day number inside a Jalali year: months 1-6 have 31 days, months 7-11 have 30
const dayOfYear = (month, day) => (month <= 6 ? (month - 1) * 31 : 186 + (month - 7) * 30) + day;

/** 'YYYY-MM-DD' (Gregorian) -> '1405/4/12'. Returns null for empty input. */
export function formatJalaliFromDateString(dateString) {
  if (!dateString) return null;
  const { year, month, day } = getJalaliPartsUtc(new Date(`${dateString}T12:00:00Z`));
  return `${year}/${month}/${day}`;
}

/**
 * '1405/4/12' or '1405-04-12' -> '2026-07-03' (Gregorian, ready for a DATE column).
 * Returns null when the date does not exist (e.g. 1405/7/31).
 * Uses the same calendar as the formatter above, so conversion round-trips.
 */
export function parseJalaliDate(input) {
  const match = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/.exec(String(input).trim());
  if (!match) return null;

  const [jy, jm, jd] = match.slice(1).map(Number);
  if (jy < 1300 || jy > 1600 || jm < 1 || jm > 12 || jd < 1 || jd > 31) return null;

  // March 25 is always a few days into Farvardin of Jalali year (gregorian year - 621)
  const anchor = new Date(Date.UTC(jy + 621, 2, 25, 12));
  const a = getJalaliPartsUtc(anchor);
  const offsetDays = dayOfYear(jm, jd) - dayOfYear(a.month, a.day);
  const target = new Date(anchor.getTime() + offsetDays * 86_400_000);

  const t = getJalaliPartsUtc(target);
  if (t.year !== jy || t.month !== jm || t.day !== jd) return null; // invalid date
  return target.toISOString().slice(0, 10);
}

/** Today's date in Iran as 'YYYY-MM-DD'. */
export const todayInTehran = () => todayFormatter.format(new Date());
