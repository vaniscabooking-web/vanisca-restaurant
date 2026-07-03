"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, ArrowUp } from "lucide-react";
import { whatsappUrl } from "@/lib/site";

export default function FloatingActions() {
  const t = useTranslations("common");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-center gap-3">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-charcoal-950/90 text-cream shadow-lg backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
      <a
        href={whatsappUrl(t("whatsappBooking"))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/30 transition-transform hover:scale-105"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  );
}
