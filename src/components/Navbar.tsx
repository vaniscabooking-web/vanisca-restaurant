"use client";

import { useState, useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Menu, X, CalendarDays, Facebook, Instagram } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { navItems, facebookUrl, instagramUrl } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * "La Ligne d'Or" — a three-zone couture navigation bar.
 *
 * At the top of the page it is fully transparent and belongs to the hero
 * wall; once scrolled it becomes glass under a drawn gold hairline. Scrolling
 * down lets it bow out (translate up, GPU-only); scrolling up brings it back
 * instantly — never hidden while the mobile menu is open or near the top.
 *
 * Desktop links sit centered, spaced to breathe, with hairline underlines
 * that grow from the centre (couture, RTL-symmetric). The mobile menu is a
 * full-screen charcoal veil that echoes the hero's gold seams, with
 * monumental serif links revealed in cascade.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const lastY = useRef(0);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        const delta = y - lastY.current;
        // Bow out only after the hero, on a decisive downward gesture.
        if (y > 480 && delta > 8) setHidden(true);
        else if (delta < -8 || y <= 480) setHidden(false);
        lastY.current = y;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Close the veil on route change; lock scroll and allow Esc while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Mobile veil focus management (modal semantics): move focus in on open,
  // return it to the toggle on close.
  useEffect(() => {
    if (open) {
      veilRef.current
        ?.querySelector<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])',
        )
        ?.focus();
    } else if (wasOpen.current) {
      toggleRef.current?.focus();
    }
    wasOpen.current = open;
  }, [open]);

  // Trap Tab within the open veil (Esc still closes it).
  const onVeilKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const veil = veilRef.current;
    if (!veil) return;
    const focusables = Array.from(
      veil.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((el) => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // No resting transform/will-change on the header: a transformed ancestor
  // would become the containing block of the fixed mobile veil.
  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,padding,background-color,box-shadow] duration-500 ${
        hidden && !open ? "-translate-y-full" : ""
      } ${
        scrolled && !open
          ? "glass rounded-none border-0 py-3 shadow-luxe"
          : "bg-transparent py-5"
      }`}
    >
      {/* Drawn gold hairline — appears only once the bar turns to glass */}
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent transition-[opacity,transform] duration-700 ${
          scrolled && !open ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
      />

      <nav
        className="container-px grid grid-cols-[1fr_auto_1fr] items-center"
        aria-label="Primary"
      >
        {/* ——— Logo, set like a fashion house ——— */}
        <Link
          href="/"
          className="group flex w-fit flex-col leading-none"
          aria-label={`Vanisca — ${t("home")}`}
        >
          <span className="heading-display latin-brand text-[1.45rem] font-semibold tracking-[0.14em] text-cream transition-colors duration-500 group-hover:text-gold-light">
            VANISCA
          </span>
          <span className="mt-1 block text-[0.52rem] uppercase tracking-[0.5em] text-gold/70 transition-[letter-spacing,color] duration-500 group-hover:tracking-[0.62em] group-hover:text-gold">
            Agadir
          </span>
        </Link>

        {/* ——— Centered links, breathing ——— */}
        <ul className="hidden items-center gap-10 lg:flex">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`group/link relative py-2 text-[0.68rem] font-medium uppercase tracking-[0.24em] transition-colors duration-300 ${
                  isActive(item.href) ? "text-gold" : "text-cream/65 hover:text-cream"
                }`}
              >
                {t(item.key)}
                {/* Couture underline — grows from the centre */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-center bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-500 ease-out ${
                    isActive(item.href)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover/link:scale-x-100"
                  }`}
                />
              </Link>
            </li>
          ))}
        </ul>

        {/* ——— Actions ——— */}
        <div className="hidden items-center justify-end gap-5 lg:flex">
          <LanguageSwitcher />
          <Link href="/reservation" className="btn-primary !px-6 !py-2.5 !text-[0.65rem]">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {t("reserve")}
          </Link>
        </div>

        {/* ——— Mobile controls ——— */}
        <div className="col-start-3 flex items-center justify-end gap-2 justify-self-end lg:hidden">
          <LanguageSwitcher compact />
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? tc("closeMenu") : tc("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-cream transition-colors duration-300 hover:border-gold/50 hover:text-gold"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* ——— The mobile veil — full-screen, echoing the hero's gold seams ——— */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={veilRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={onVeilKeyDown}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE } }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-0 top-0 -z-10 flex flex-col bg-charcoal-950/[0.97] pb-10 pt-28 backdrop-blur-2xl lg:hidden"
          >
            {/* Gold seams carried over from the hero wall */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-16 left-1/3 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-16 left-2/3 w-px bg-gradient-to-b from-transparent via-gold/25 to-transparent"
            />

            <motion.ul
              initial={reduce ? false : "hidden"}
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
              className="container-px flex flex-1 flex-col justify-center gap-2"
            >
              {navItems.map((item) => (
                <motion.li
                  key={item.key}
                  variants={{
                    hidden: { opacity: 0, y: 26 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
                  }}
                >
                  <Link
                    href={item.href}
                    className={`group/m flex items-baseline gap-4 py-3 ${
                      isActive(item.href) ? "text-gold" : "text-cream"
                    }`}
                  >
                    <span className="heading-display text-4xl font-medium transition-colors duration-300 group-hover/m:text-gold-light sm:text-5xl">
                      {t(item.key)}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-px flex-1 bg-gradient-to-r from-gold/40 to-transparent transition-opacity duration-500 ${
                        isActive(item.href) ? "opacity-100" : "opacity-0 group-hover/m:opacity-60"
                      }`}
                    />
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
              className="container-px flex flex-col gap-6"
            >
              <Link href="/reservation" className="btn-primary w-full">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {t("reserve")}
              </Link>
              <div className="flex items-center justify-center gap-4">
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook — Vanisca Restaurant"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram — Vanisca Restaurant"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-cream/70 transition-colors duration-300 hover:border-gold hover:text-gold"
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
