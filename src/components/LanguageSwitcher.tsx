"use client";

import { useState, useRef, useEffect, type KeyboardEvent } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close on outside interaction (pointerdown covers mouse + touch).
  useEffect(() => {
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, []);

  // On open, move focus to the active option (WAI-ARIA listbox pattern).
  useEffect(() => {
    if (!open) return;
    const idx = Math.max(0, locales.indexOf(locale));
    optionRefs.current[idx]?.focus();
  }, [open, locale]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const switchTo = (next: Locale) => {
    close(false);
    if (next === locale) return;
    // Preserve dynamic params and current path on the new locale.
    router.replace(
      // @ts-expect-error -- route params are passed through unchanged
      { pathname, params },
      { locale: next },
    );
  };

  const onTriggerKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
    } else if (open && e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const onListKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    const n = locales.length;
    const current = optionRefs.current.findIndex((el) => el === document.activeElement);
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      optionRefs.current[(current + 1) % n]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      optionRefs.current[(current - 1 + n) % n]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      optionRefs.current[n - 1]?.focus();
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
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
          tabIndex={-1}
          aria-label="Language"
          onKeyDown={onListKeyDown}
          className="absolute end-0 z-50 mt-2 min-w-[10rem] overflow-hidden rounded-xl border border-white/10 bg-charcoal-950/95 p-1 shadow-2xl backdrop-blur"
        >
          {locales.map((l, i) => (
            <li key={l} role="option" aria-selected={l === locale}>
              <button
                ref={(el) => {
                  optionRefs.current[i] = el;
                }}
                type="button"
                onClick={() => switchTo(l)}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm text-cream/90 transition-colors hover:bg-white/5 focus-visible:bg-white/5"
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
