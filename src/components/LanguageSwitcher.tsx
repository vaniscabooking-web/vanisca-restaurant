"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Globe, Check, ChevronDown } from "lucide-react";
import {
  usePathname,
  useRouter,
  locales,
  localeMeta,
  type Locale,
} from "@/i18n/routing";

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    // Preserve dynamic params and current path on the new locale.
    router.replace(
      // @ts-expect-error -- route params are passed through unchanged
      { pathname, params },
      { locale: next },
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Language"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm text-cream transition-colors hover:border-gold/50 hover:text-gold"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        {!compact && <span className="font-medium">{localeMeta[locale].label}</span>}
        <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute end-0 z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-charcoal-950/95 p-1 shadow-2xl backdrop-blur"
        >
          {locales.map((l) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                type="button"
                onClick={() => switchTo(l)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-cream/90 transition-colors hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true">{localeMeta[l].flag}</span>
                  {localeMeta[l].label}
                </span>
                {l === locale && (
                  <Check className="h-4 w-4 text-gold" aria-hidden="true" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
