"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, Send, AlertTriangle } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      subject: String(fd.get("subject") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""),
    };
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  // Focus/label treatment mirrors ReservationForm so both booking surfaces feel
  // like one couture system.
  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/55 transition-[border-color,background-color,box-shadow] duration-300 focus:border-gold/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-gold/25";
  const labelClass = "mb-1.5 block text-sm font-medium tracking-wide text-cream/80";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "submitting"}
      className="card-surface p-6 sm:p-10"
    >
      {/* -start- (logical) keeps the honeypot offscreen in RTL too — a physical
          -left offset becomes a scrollable void on Arabic pages. */}
      <div className="absolute -start-[9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className={labelClass}>
            {t("form.name")}
          </label>
          <input id="c-name" name="name" required autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="c-email" className={labelClass}>
            {t("form.email")}
          </label>
          <input
            id="c-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-subject" className={labelClass}>
            {t("form.subject")}
          </label>
          <input id="c-subject" name="subject" required className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="c-message" className={labelClass}>
            {t("form.message")}
          </label>
          <textarea
            id="c-message"
            name="message"
            rows={5}
            required
            maxLength={2000}
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>

      {status === "success" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-gold" role="status">
          <CheckCircle2 className="h-4 w-4" /> {t("success")}
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 flex items-center gap-2 text-sm text-red-400" role="alert">
          <AlertTriangle className="h-4 w-4" /> {t("error")}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-6 w-full sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("form.submitting")}
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> {t("form.submit")}
          </>
        )}
      </button>
    </form>
  );
}
