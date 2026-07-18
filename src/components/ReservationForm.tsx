"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  User,
  Phone,
  MessageCircle,
  Mail,
  CalendarDays,
  Clock,
  Users,
  Sparkles,
  Paperclip,
} from "lucide-react";
import {
  MAX_FILE_BYTES,
  MAX_TOTAL_ATTACH_BYTES,
  MAX_ATTACHMENTS,
  ALLOWED_FILE_TYPES,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? "");
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReservationForm() {
  const t = useTranslations("reservation");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().split("T")[0];

  // The form is replaced by the confirmation on success — move focus to it so
  // keyboard and screen-reader users are told the booking was sent.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFieldError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);

    // Client-side file handling + validation (multiple attachments supported)
    const files = (fd.getAll("attachment") as File[]).filter(
      (f) => f && f.size > 0,
    );
    if (files.length > MAX_ATTACHMENTS) {
      setFieldError(t("validation.fileTooLarge"));
      return;
    }
    let totalBytes = 0;
    const attachments: Record<string, unknown>[] = [];
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        setFieldError(t("validation.fileTooLarge"));
        return;
      }
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setFieldError(t("validation.fileType"));
        return;
      }
      totalBytes += file.size;
      if (totalBytes > MAX_TOTAL_ATTACH_BYTES) {
        setFieldError(t("validation.fileTooLarge"));
        return;
      }
      attachments.push({
        name: file.name,
        type: file.type,
        size: file.size,
        data: await fileToBase64(file),
      });
    }

    const payload = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      whatsapp: String(fd.get("whatsapp") ?? ""),
      email: String(fd.get("email") ?? ""),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      guests: Number(fd.get("guests") ?? 2),
      occasion: String(fd.get("occasion") ?? ""),
      message: String(fd.get("message") ?? ""),
      company: String(fd.get("company") ?? ""), // honeypot
      attachments,
    };

    setStatus("submitting");
    try {
      const res = await fetch("/api/reservation", {
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

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="card-surface flex flex-col items-center p-10 text-center outline-none"
      >
        <CheckCircle2 className="h-14 w-14 text-emerald-400" aria-hidden="true" />
        <h3 className="heading-display mt-5 text-2xl font-semibold text-cream">
          {t("success.title")}
        </h3>
        <p className="mt-3 max-w-md text-cream/70">{t("success.body")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="btn-outline mt-7"
        >
          {t("title")}
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream placeholder:text-cream/55 transition-colors focus:border-gold/60 focus:bg-white/[0.07] focus:outline-none";
  const labelClass =
    "mb-1.5 flex items-center gap-2 text-sm font-medium text-cream/80";

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-busy={status === "submitting"}
      className="card-surface p-6 sm:p-8"
    >
      {/* Honeypot (visually hidden, not announced) */}
      {/* -start- (logical) keeps the honeypot offscreen in RTL too — a physical
          -left offset becomes a scrollable void on Arabic pages. */}
      <div className="absolute -start-[9999px]" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="name" className={labelClass}>
            <User className="h-4 w-4 text-gold/70" /> {t("form.name")}
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder={t("form.namePlaceholder")}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            <Phone className="h-4 w-4 text-gold/70" /> {t("form.phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder={t("form.phonePlaceholder")}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="whatsapp" className={labelClass}>
            <MessageCircle className="h-4 w-4 text-gold/70" /> {t("form.whatsapp")}
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            placeholder={t("form.whatsappPlaceholder")}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className={labelClass}>
            <Mail className="h-4 w-4 text-gold/70" /> {t("form.email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t("form.emailPlaceholder")}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="date" className={labelClass}>
            <CalendarDays className="h-4 w-4 text-gold/70" /> {t("form.date")}
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            min={today}
            className={`${inputClass} [color-scheme:dark]`}
          />
        </div>

        <div>
          <label htmlFor="time" className={labelClass}>
            <Clock className="h-4 w-4 text-gold/70" /> {t("form.time")}
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className={`${inputClass} [color-scheme:dark]`}
          />
        </div>

        <div>
          <label htmlFor="guests" className={labelClass}>
            <Users className="h-4 w-4 text-gold/70" /> {t("form.guests")}
          </label>
          <select
            id="guests"
            name="guests"
            required
            defaultValue="2"
            className={`${inputClass} [color-scheme:dark]`}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? t("form.guest") : t("form.guestsPlural")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="occasion" className={labelClass}>
            <Sparkles className="h-4 w-4 text-gold/70" /> {t("form.occasion")}
          </label>
          <input
            id="occasion"
            name="occasion"
            placeholder={t("form.occasionPlaceholder")}
            className={inputClass}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="message" className={labelClass}>
            {t("form.message")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={3}
            maxLength={1000}
            placeholder={t("form.messagePlaceholder")}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="attachment" className={labelClass}>
            <Paperclip className="h-4 w-4 text-gold/70" /> {t("form.attachment")}
          </label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            multiple
            accept={ALLOWED_FILE_TYPES.join(",")}
            className="block w-full text-sm text-cream/70 file:me-4 file:rounded-full file:border-0 file:bg-gold/15 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gold hover:file:bg-gold/25"
          />
          <p className="mt-1.5 text-xs text-cream/60">{t("form.attachmentHint")}</p>
        </div>
      </div>

      {fieldError && (
        <p className="mt-4 flex items-center gap-2 text-sm text-red-400" role="alert">
          <AlertTriangle className="h-4 w-4" /> {fieldError}
        </p>
      )}

      {status === "error" && (
        <div
          className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200"
          role="alert"
        >
          <p className="font-semibold">{t("error.title")}</p>
          <p className="mt-1 text-red-200/80">{t("error.body")}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-primary mt-7 w-full"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t("form.submitting")}
          </>
        ) : (
          <>
            <CalendarDays className="h-4 w-4" /> {t("form.submit")}
          </>
        )}
      </button>
    </form>
  );
}
