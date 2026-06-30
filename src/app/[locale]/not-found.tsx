import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5 pt-24 text-center">
      <div>
        <p className="heading-display text-7xl font-bold text-gradient-gold">404</p>
        <h1 className="heading-display mt-4 text-2xl font-semibold text-cream sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-cream/70">{t("body")}</p>
        <Link href="/" className="btn-primary mt-8">
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
