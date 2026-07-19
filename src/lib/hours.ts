/**
 * Vanisca opening hours (owner-provided). The kitchen runs past midnight, so a
 * service evening starts at 12:00 and closes early the following morning:
 *   Friday & Saturday : 12:00 – 01:30
 *   Sunday – Thursday : 12:00 – 02:00
 *
 * Single source of truth for BOTH the displayed schedule and booking-slot
 * validation, so the two can never drift apart.
 */

export const SERVICE = {
  openHour: 12, // opens 12:00 every day
  // closing time expressed in minutes past midnight of the following morning
  weekendCloseMin: 90, // 01:30 (Fri, Sat)
  weekdayCloseMin: 120, // 02:00 (Sun–Thu)
} as const;

/** JS getDay(): 0=Sun … 6=Sat. Friday & Saturday run the later weekend service. */
export function isWeekendService(weekday: number): boolean {
  return weekday === 5 || weekday === 6;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * Bookable 30-minute time slots ("HH:MM") for a given weekday, from opening to
 * the last seating before close. Slots between 00:00 and closing belong to the
 * same service evening. Used to validate reservation times against real hours.
 */
export function bookingSlots(weekday: number): string[] {
  const closeMin = isWeekendService(weekday)
    ? SERVICE.weekendCloseMin
    : SERVICE.weekdayCloseMin;
  const slots: string[] = [];
  // 12:00 → 23:30 (same calendar day)
  for (let h = SERVICE.openHour; h < 24; h++) {
    for (const m of [0, 30]) slots.push(`${pad(h)}:${pad(m)}`);
  }
  // 00:00 → close, last seating 30 min before closing
  for (let min = 0; min <= closeMin - 30; min += 30) {
    slots.push(`${pad(Math.floor(min / 60))}:${pad(min % 60)}`);
  }
  return slots;
}

/** Whether a given "HH:MM" time is a valid seating for the weekday. */
export function isValidSlot(weekday: number, time: string): boolean {
  return bookingSlots(weekday).includes(time);
}

/* ------------------------------------------------------------------ *
 * Display helpers — presentation only.
 * Derived from SERVICE above so the published schedule can never drift
 * from booking-slot validation or the JSON-LD opening hours.
 * ------------------------------------------------------------------ */

/** Owner-defined reading order: the week starts on Monday. */
export const WEEK_ORDER = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
export type DayKey = (typeof WEEK_ORDER)[number];

/** JS getDay() index per day key (0 = Sunday). */
const DAY_INDEX: Record<DayKey, number> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

function minutesToHhmm(min: number): string {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
}

export interface DaySchedule {
  key: DayKey;
  opens: string;
  closes: string;
}

/** The week's service, Monday → Sunday, ready to render. */
export const weekSchedule: DaySchedule[] = WEEK_ORDER.map((key) => ({
  key,
  opens: `${pad(SERVICE.openHour)}:00`,
  closes: minutesToHhmm(
    isWeekendService(DAY_INDEX[key])
      ? SERVICE.weekendCloseMin
      : SERVICE.weekdayCloseMin,
  ),
}));
