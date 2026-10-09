import { z } from "zod";
export const imageUrl = z.string().min(1).max(2048).refine(value => /^\/(?!\/)[^\s\\]+$/.test(value) || /^https:\/\/[^\s]+$/.test(value), "ต้องเป็น URL ภาพ https หรือ path ภายในเว็บ");
const base = { id: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/), title: z.string().trim().min(1).max(120), src: imageUrl, order: z.number().int().min(0).max(10000), published: z.boolean() };
export const workSchema = z.object({ ...base, subtitle: z.string().trim().max(500), images: z.array(imageUrl).min(1).max(30) });
export const serviceSchema = z.object({ ...base, detail: z.string().trim().min(1).max(1000), icon: z.enum(["sign", "print", "sticker", "design"]), color: z.enum(["yellow", "pink", "cyan", "black"]) });

const text = z.string().trim().min(1, "กรุณากรอกข้อความ").max(2000);
const label = z.string().trim().min(1).max(120);
export const siteSettingsSchema = z.object({
  logo: imageUrl, browserIcon: imageUrl, heroImage: imageUrl, qrImage: imageUrl,
  phone: z.string().trim().regex(/^\+?[\d\s()-]{6,30}$/, "เบอร์โทรไม่ถูกต้อง"),
  lineId: z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9._@-]+$/, "LINE ID ไม่ถูกต้อง"),
  facebookUrl: z.string().url().max(2048).refine(value => { try { const u = new URL(value); return u.protocol === "https:" && (u.hostname === "facebook.com" || u.hostname.endsWith(".facebook.com") || u.hostname === "fb.me"); } catch { return false; } }, "กรุณาใช้ลิงก์ Facebook แบบ https"),
  heroEyebrow: text, heroHeadline: z.tuple([label, label, label]), heroDescription: text,
  navLabels: z.tuple([label, label, label, label, label]), quoteLabel: label, heroPrimaryLabel: label, heroSecondaryLabel: label,
  qrTitle: label, qrDescription: label, contactButtonLabel: label,
  servicesEyebrow: label, servicesTitle: label, servicesSubtitle: text, servicesDescription: text,
  worksEyebrow: label, worksTitle: label, worksSubtitle: text,
  processEyebrow: label, processTitle: label, processSubtitle: text,
  contactHeadline: text, contactDescription: text,
  steps: z.array(z.object({ title: label, detail: text, icon: z.enum(["chat", "document", "gear", "check"]), color: z.enum(["yellow", "pink", "cyan"]) })).min(1).max(12),
});
