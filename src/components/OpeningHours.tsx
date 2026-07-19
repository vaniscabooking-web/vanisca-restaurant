import { useTranslations } from "next-intl";
import { weekSchedule } from "@/lib/hours";

/**
 * The week's service, set as an editorial schedule: day on the reading side,
 * a hairline leader carrying the eye across, the time range aligned on the
 * far side in tabular figures so every row's digits stack in a clean column.
 *
 * The rows come from `weekSchedule`, which is derived from SERVICE — the same
 * source the booking slots and JSON-LD use — so the published hours can never
 * drift from the ones the reservation form actually accepts.
 *
 * Layout is flex + logical spacing, so Arabic mirrors it without any RTL
 * special-casing.
 */
export default function OpeningHours({ className = "" }: { className?: string }) {
  const t = useTranslations("hours");

  return (
    <dl className={`w-full max-w-sm ${className}`}>
      {weekSchedule.map((day) => (
        <div
          key={day.key}
          className="flex items-baseline gap-3 border-b border-white/[0.06] py-2 last:border-0"
        >
          <dt className="shrink-0 text-sm text-cream/75">{t(`days.${day.key}`)}</dt>
          <span aria-hidden="true" className="h-px min-w-4 flex-1 bg-white/10" />
          <dd className="shrink-0 text-sm tabular-nums text-cream/90">
            {day.opens} – {day.closes}
          </dd>
        </div>
      ))}
    </dl>
  );
}
