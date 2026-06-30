"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, CalendarDays } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { navItems } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change & lock scroll when open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-charcoal-950/90 py-3 shadow-lg backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="container-px flex items-center justify-between" aria-label="Primary">
        <Link
          href="/"
          className="group flex flex-col leading-none"
          aria-label={`${"Vanisca"} — ${t("home")}`}
        >
          <span className="heading-display text-2xl font-bold tracking-wide text-cream">
            Vanisca
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.35em] text-gold/80">
            Agadir
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`relative text-sm font-medium uppercase tracking-wide transition-colors hover:text-gold ${
                    isActive(item.href) ? "text-gold" : "text-cream/80"
                  }`}
                >
                  {t(item.key)}
                  {isActive(item.href) && (
                    <span className="absolute -bottom-1.5 start-0 h-px w-full bg-gold-gradient" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
          <Link href="/reservation" className="btn-primary !px-5 !py-2.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {t("reserve")}
          </Link>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-cream"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      <div
        className={`fixed inset-0 top-[64px] z-40 origin-top bg-charcoal-950/98 backdrop-blur-md transition-all duration-300 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="container-px flex flex-col gap-1 py-6">
          {navItems.map((item) => (
            <li key={item.key}>
              <Link
                href={item.href}
                className={`block rounded-xl px-4 py-4 text-lg font-medium transition-colors ${
                  isActive(item.href)
                    ? "bg-white/5 text-gold"
                    : "text-cream/90 hover:bg-white/5"
                }`}
              >
                {t(item.key)}
              </Link>
            </li>
          ))}
          <li className="mt-3">
            <Link href="/reservation" className="btn-primary w-full">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              {t("reserve")}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
