"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadIcon, PlusIcon, TrashIcon, ChevronUpIcon, ChevronDownIcon, CheckIcon } from "@radix-ui/react-icons";
import type { SiteSettings } from "@/lib/site-settings";
import { settingsSections, type SettingsSection, type SettingField } from "@/lib/settings-sections";

export default function SettingsManager({ initial, section, uploadReady }: { initial: SiteSettings; section: SettingsSection; uploadReady: boolean }) {
  const [draft, setDraft] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const config = settingsSections[section];
  function change(key: keyof SiteSettings, value: SiteSettings[keyof SiteSettings]) { setDraft(current => ({ ...current, [key]: value })); setDirty(true); setNotice(""); }
  async function upload(file: File | undefined, key: keyof SiteSettings) {
    if (!file) return;
    setError(""); setNotice("");
    if (file.size > 4 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("รองรับ JPG, PNG, WebP ไม่เกิน 4 MB ต่อรูป"); return; }
    setUploading(key);
    try {
      const body = new FormData(); body.append("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "อัปโหลดไม่สำเร็จ");
      change(key, result.url); setNotice("อัปโหลดเรียบร้อย กดบันทึกเพื่อแสดงบนเว็บไซต์");
    } catch (e) { setError(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ"); }
    finally { setUploading(null); }
  }
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const body = Object.fromEntries(config.fields.map(field => [field.key, draft[field.key]]));
      const response = await fetch(`/api/admin/settings?section=${section}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "บันทึกไม่สำเร็จ");
      setDirty(false); setNotice("บันทึกเรียบร้อย หน้าเว็บไซต์อัปเดตแล้ว"); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ"); }
    finally { setBusy(false); }
  }
  function moveStep(index: number, direction: number) {
    const steps = [...draft.steps], target = index + direction;
    if (target < 0 || target >= steps.length) return;
    [steps[index], steps[target]] = [steps[target], steps[index]]; change("steps", steps);
  }
  function field(field: SettingField) {
    const value = draft[field.key];
    if (field.type === "image") return <div key={field.key} className="settings-image-field"><h3>{field.label}</h3><div className={`settings-image-preview ${field.key === "logo" ? "logo-preview" : ""}`}><Image src={value as string} alt={field.label} fill sizes="500px" unoptimized /></div><label className="settings-upload"><UploadIcon />{uploading === field.key ? "กำลังอัปโหลด…" : "อัปโหลดภาพใหม่"}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!uploadReady || busy || uploading !== null} onChange={e => { void upload(e.target.files?.[0], field.key); e.target.value = ""; }} /></label><small>JPG, PNG, WebP • สูงสุด 4 MB</small></div>;
    if (field.type === "lines") return <div key={field.key} className="settings-lines"><h3>{field.label}</h3>{(value as string[]).map((line, index) => <label key={index}><span>{field.key === "navLabels" ? ["หน้าแรก", "บริการ", "ผลงาน", "ขั้นตอน", "ติดต่อ"][index] : `บรรทัด ${index + 1}`}</span><input required maxLength={120} value={line} onChange={e => change(field.key, (value as string[]).map((item, i) => i === index ? e.target.value : item) as SiteSettings["heroHeadline"] | SiteSettings["navLabels"])} /></label>)}</div>;
    if (field.type === "steps") return <div key={field.key} className="settings-steps"><div className="settings-step-header"><h3>รายการขั้นตอน ({draft.steps.length}/12)</h3><button type="button" className="admin-btn subtle" disabled={draft.steps.length >= 12} onClick={() => change("steps", [...draft.steps, { title: "ขั้นตอนใหม่", detail: "รายละเอียดขั้นตอน", icon: "chat", color: "yellow" }])}><PlusIcon /> เพิ่มขั้นตอน</button></div>{draft.steps.map((step, index) => <div className="settings-step" key={index}><div className="settings-step-header"><strong>ขั้นตอน {String(index + 1).padStart(2, "0")}</strong><div className="admin-row-actions"><button type="button" className="admin-icon-btn" aria-label={`เลื่อนขั้นตอน ${index + 1} ขึ้น`} disabled={index === 0} onClick={() => moveStep(index, -1)}><ChevronUpIcon /></button><button type="button" className="admin-icon-btn" aria-label={`เลื่อนขั้นตอน ${index + 1} ลง`} disabled={index === draft.steps.length - 1} onClick={() => moveStep(index, 1)}><ChevronDownIcon /></button><button type="button" className="admin-icon-btn danger" aria-label={`ลบขั้นตอน ${index + 1}`} disabled={draft.steps.length === 1} onClick={() => change("steps", draft.steps.filter((_, i) => i !== index))}><TrashIcon /></button></div></div><label>ชื่อขั้นตอน<input required maxLength={120} value={step.title} onChange={e => change("steps", draft.steps.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} /></label><label>รายละเอียด<textarea required maxLength={2000} rows={2} value={step.detail} onChange={e => change("steps", draft.steps.map((item, i) => i === index ? { ...item, detail: e.target.value } : item))} /></label><div className="admin-form-grid"><label>ไอคอน<select value={step.icon} onChange={e => change("steps", draft.steps.map((item, i) => i === index ? { ...item, icon: e.target.value as typeof step.icon } : item))}><option value="chat">พูดคุย</option><option value="document">เอกสาร / ออกแบบ</option><option value="gear">ผลิตงาน</option><option value="check">เสร็จสิ้น / ติดตั้ง</option></select></label><label>สี<select value={step.color} onChange={e => change("steps", draft.steps.map((item, i) => i === index ? { ...item, color: e.target.value as typeof step.color } : item))}><option value="yellow">เหลือง</option><option value="pink">ชมพู</option><option value="cyan">ฟ้า</option></select></label></div></div>)}</div>;
    return <label key={field.key}>{field.label}{field.type === "textarea" ? <textarea required rows={3} maxLength={2000} value={value as string} onChange={e => change(field.key, e.target.value)} /> : <input required maxLength={field.key === "facebookUrl" ? 2048 : 2000} type={field.key === "facebookUrl" ? "url" : "text"} value={value as string} onChange={e => change(field.key, e.target.value)} />}</label>;
  }
  return <div className="content-workspace"><div className="content-breadcrumb">จัดการเว็บไซต์ <span>/</span><strong>{config.title}</strong></div><header className="admin-top"><div><span className="admin-kicker">WEBSITE SETTINGS</span><h1>{config.title}</h1><p>{config.description}</p></div><a className="admin-btn content-preview" href="/" target="_blank" rel="noreferrer">ดูหน้าเว็บไซต์</a></header><form onSubmit={save} className="settings-form">{error && <div className="admin-error" role="alert">{error}</div>}{notice && <div className="admin-success" role="status">{notice}</div>}{!uploadReady && <div className="admin-notice">ระบบอัปโหลดภาพยังไม่พร้อม</div>}<fieldset disabled={busy || uploading !== null}><div className="settings-fields">{config.fields.map(field)}</div></fieldset><div className="settings-save"><span>{dirty ? "มีการเปลี่ยนแปลงที่ยังไม่บันทึก" : "ข้อมูลปัจจุบัน"}</span><button className="admin-btn primary" disabled={busy || uploading !== null || !dirty}><CheckIcon />{busy ? "กำลังบันทึก…" : "บันทึกการเปลี่ยนแปลง"}</button></div></form></div>;
}
