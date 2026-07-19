"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";

/**
 * Branded route-segment error boundary. Renders inside the locale layout (so
 * navbar/footer/3D remain), keeping a failed render on-brand instead of Next's
 * default page. Copy is inlined per locale so it needs no message-file changes
 * and can't throw MISSING_MESSAGE while already in an error state. RTL is
 * inherited from the layout's `dir`.
 */

const COPY = {
  fr: {
    eyebrow: "Erreur",
    title: "Une erreur est survenue",
    body: "Un incident inattendu s'est produit. Réessayez, ou revenez à l'accueil.",
    retry: "Réessayer",
    home: "Retour à l'accueil",
  },
  en: {
    eyebrow: "Error",
    title: "Something went wrong",
    body: "An unexpected error occurred. Please try again, or return home.",
    retry: "Try again",
    home: "Back to home",
  },
  ar: {
    eyebrow: "خطأ",
    title: "حدث خطأ ما",
    body: "حدث خطأ غير متوقع. حاول مرة أخرى أو عد إلى الصفحة الرئيسية.",
    retry: "حاول مرة أخرى",
    home: "العودة إلى الرئيسية",
  },
} as const;

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale() as keyof typeof COPY;
  const c = COPY[locale] ?? COPY.fr;

  useEffect(() => {
    // Surface for observability (no PII).
    console.error(error);
  }, [error]);

  return (
    <div className="bg-marble flex min-h-[70svh] items-center">
      <div className="container-px mx-auto max-w-xl text-center">
        <span className="eyebrow justify-center">{c.eyebrow}</span>
        <h1 className="heading-display mt-4 text-4xl font-medium text-cream sm:text-5xl">
          {c.title}
        </h1>
        <span className="rule-gold mx-auto mt-6 block" aria-hidden="true" />
        <p className="mt-6 text-base font-light leading-relaxed text-cream/70">
          {c.body}
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button type="button" onClick={reset} className="btn-primary w-full sm:w-auto">
            {c.retry}
          </button>
          <Link href="/" className="btn-outline w-full sm:w-auto">
            {c.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
