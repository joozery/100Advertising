import type { SiteSettings } from "./site-settings";
export type SettingField = { key: keyof SiteSettings; label: string; type?: "image" | "textarea" | "lines" | "steps" };
export const settingsSections = {
  hero: { title: "หน้าแรก / Hero", description: "ข้อความหลัก ภาพพื้นหลัง และ QR code", fields: [
    { key: "heroImage", label: "ภาพพื้นหลัง", type: "image" }, { key: "qrImage", label: "QR code", type: "image" },
    { key: "heroEyebrow", label: "ข้อความเหนือหัวข้อ" }, { key: "heroHeadline", label: "หัวข้อหลัก (3 บรรทัด)", type: "lines" },
    { key: "heroDescription", label: "คำอธิบาย", type: "textarea" }, { key: "heroPrimaryLabel", label: "ปุ่มติดต่อ" }, { key: "heroSecondaryLabel", label: "ปุ่มดูผลงาน" },
    { key: "qrTitle", label: "หัวข้อ QR code" }, { key: "qrDescription", label: "คำอธิบาย QR code" },
  ] },
  branding: { title: "โลโก้และเมนู", description: "ภาพแบรนด์ ไอคอนเบราว์เซอร์ และชื่อเมนู", fields: [
    { key: "logo", label: "โลโก้เว็บไซต์", type: "image" }, { key: "browserIcon", label: "ไอคอนบนเบราว์เซอร์", type: "image" },
    { key: "navLabels", label: "เมนูหลักและเมนูท้ายเว็บ (5 เมนู)", type: "lines" }, { key: "quoteLabel", label: "ปุ่มขอใบเสนอราคา" },
  ] },
  sections: { title: "หัวข้อแต่ละส่วน", description: "ข้อความหัวข้อและคำอธิบายในส่วนบริการและผลงาน", fields: [
    { key: "servicesEyebrow", label: "หัวข้อย่อยบริการ" }, { key: "servicesTitle", label: "หัวข้อบริการ" }, { key: "servicesSubtitle", label: "คำโปรยบริการ" }, { key: "servicesDescription", label: "รายละเอียดบริการ", type: "textarea" },
    { key: "worksEyebrow", label: "หัวข้อย่อยผลงาน" }, { key: "worksTitle", label: "หัวข้อผลงาน" }, { key: "worksSubtitle", label: "คำโปรยผลงาน" },
  ] },
  process: { title: "ขั้นตอนการทำงาน", description: "เพิ่ม แก้ไข และจัดลำดับขั้นตอนการทำงาน", fields: [
    { key: "processEyebrow", label: "หัวข้อย่อย" }, { key: "processTitle", label: "หัวข้อหลัก" }, { key: "processSubtitle", label: "คำโปรย" }, { key: "steps", label: "ขั้นตอน", type: "steps" },
  ] },
  contact: { title: "ติดต่อเรา", description: "ข้อมูลติดต่อและข้อความส่วนท้ายเว็บไซต์", fields: [
    { key: "phone", label: "เบอร์โทร" }, { key: "lineId", label: "LINE ID" }, { key: "facebookUrl", label: "Facebook URL" },
    { key: "contactHeadline", label: "หัวข้อส่วนติดต่อ", type: "textarea" }, { key: "contactDescription", label: "คำอธิบาย", type: "textarea" }, { key: "contactButtonLabel", label: "ข้อความปุ่มติดต่อ" },
  ] },
} satisfies Record<string, { title: string; description: string; fields: SettingField[] }>;
export type SettingsSection = keyof typeof settingsSections;
export function isSettingsSection(value: string): value is SettingsSection { return Object.hasOwn(settingsSections, value); }
