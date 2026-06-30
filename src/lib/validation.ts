import { z } from "zod";

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];

/** Loose international/Moroccan phone check: digits, spaces, +, -, (). */
const phoneRegex = /^[+]?[\d\s().-]{6,20}$/;

export const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(phoneRegex),
  whatsapp: z
    .string()
    .trim()
    .regex(phoneRegex)
    .max(20)
    .optional()
    .or(z.literal("")),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  date: z.string().trim().min(1),
  time: z.string().trim().min(1),
  guests: z.coerce.number().int().min(1).max(50),
  occasion: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(1000).optional().or(z.literal("")),
  // Honeypot — must be empty (bots tend to fill every field).
  company: z.string().max(0).optional().or(z.literal("")),
  // Optional base64 attachment metadata.
  attachment: z
    .object({
      name: z.string().max(200),
      type: z.string().max(100),
      size: z.number().max(MAX_FILE_BYTES),
      data: z.string(), // base64 (without data: prefix)
    })
    .nullable()
    .optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  subject: z.string().trim().min(2).max(150),
  message: z.string().trim().min(5).max(2000),
  company: z.string().max(0).optional().or(z.literal("")), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * Strip ASCII control characters (code points < 32 and 127) and trim.
 * Implemented as a loop to avoid embedding control chars in source.
 */
export function sanitize(value: string): string {
  let out = "";
  for (const ch of value) {
    const code = ch.codePointAt(0) ?? 0;
    if (code < 32 || code === 127) continue;
    out += ch;
  }
  return out.trim();
}
