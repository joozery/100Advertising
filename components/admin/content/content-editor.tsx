"use client";
import { Dialog } from "radix-ui";
import Image from "next/image";
import { UploadIcon, Cross2Icon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { ContentKind, Service } from "@/lib/types";
import type { Draft } from "./types";
import GalleryEditor from "./gallery-editor";
export default function ContentEditor({ draft, setDraft, kind, existing, busy, uploading, uploadReady, save, upload, reorderImage, setError, error, notice }: {
    error: string;
    notice: string;
    draft: Draft;
    setDraft: Dispatch<SetStateAction<Draft | null>>;
    kind: ContentKind;
    existing: boolean;
    busy: boolean;
    uploading: boolean;
    uploadReady: boolean;
    save: (event: FormEvent) => void;
    upload: (files: FileList | null, gallery: boolean) => Promise<void>;
    reorderImage: (index: number, direction: number) => void;
    setError: (error: string) => void;
}) {
    return (<Dialog.Root open onOpenChange={open => { if (!open && !busy && !uploading) setDraft(null); }}><Dialog.Portal><Dialog.Overlay className="content-dialog-overlay" /><Dialog.Content className="admin-shell content-workspace content-dialog" onEscapeKeyDown={event => { if (busy || uploading) event.preventDefault(); }} onPointerDownOutside={event => event.preventDefault()}><form onSubmit={save} className="admin-editor"><div className="admin-editor-heading"><div><Dialog.Title>{existing ? "แก้ไข" : "เพิ่ม"}{kind === "works" ? "ผลงาน" : "บริการ"}</Dialog.Title><Dialog.Description className="content-dialog-description">{kind === "works" ? "จัดการรายละเอียด ภาพปก และรูปภาพในแกลเลอรี" : "จัดการรายละเอียด ภาพประกอบ และรูปแบบบริการ"}</Dialog.Description></div><button type="button" className="admin-icon-btn" aria-label="ปิดแบบฟอร์ม" onClick={() => setDraft(null)} disabled={busy || uploading}><Cross2Icon /></button></div><div className="content-dialog-body">{error && <div className="admin-error" role="alert">{error}</div>}{notice && <div className="admin-success" role="status">{notice}</div>}<fieldset disabled={busy || uploading}>
          <label>ชื่อ{kind === "works" ? "ผลงาน" : "บริการ"}<input required maxLength={120} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })}/></label>
          <label>รายละเอียด<textarea required={kind === "services"} maxLength={kind === "works" ? 500 : 1000} rows={3} value={kind === "works" ? draft.subtitle : draft.detail} onChange={e => setDraft({ ...draft, [kind === "works" ? "subtitle" : "detail"]: e.target.value })}/></label>
          <div className="admin-form-grid"><label>ลำดับแสดงผล<input type="number" min={1} max={10001} required value={draft.order + 1} onChange={e => setDraft({ ...draft, order: Number(e.target.value) - 1 })}/></label><label>สถานะ<select value={draft.published ? "published" : "draft"} onChange={e => setDraft({ ...draft, published: e.target.value === "published" })}><option value="published">เผยแพร่</option><option value="draft">ซ่อน / ฉบับร่าง</option></select></label></div>
          {kind === "services" && <div className="admin-form-grid"><label>ไอคอน<select value={draft.icon} onChange={e => setDraft({ ...draft, icon: e.target.value as Service["icon"] })}><option value="sign">ป้าย</option><option value="print">งานพิมพ์</option><option value="sticker">สติ๊กเกอร์</option><option value="design">ออกแบบ</option></select></label><label>สี<select value={draft.color} onChange={e => setDraft({ ...draft, color: e.target.value as Service["color"] })}><option value="yellow">เหลือง</option><option value="pink">ชมพู</option><option value="cyan">ฟ้า</option><option value="black">ดำ</option></select></label></div>}
          <h3 className="admin-field-title">ภาพปก</h3>{draft.src && <div className="admin-cover-preview"><Image src={draft.src} alt="ตัวอย่างภาพปก" fill sizes="400px" unoptimized/></div>}
          <label className={uploadReady ? "admin-upload" : "admin-upload disabled"}><UploadIcon /> อัปโหลดภาพปก<input type="file" accept="image/jpeg,image/png,image/webp" disabled={!uploadReady || uploading} onChange={e => { void upload(e.target.files, false); e.target.value = ""; }}/></label>
          {kind === "works" && <GalleryEditor draft={draft} setDraft={setDraft} uploadReady={uploadReady} uploading={uploading} upload={upload} reorderImage={reorderImage} setError={setError}/>}
          <small className="admin-hint">รองรับ JPG, PNG, WebP ไม่เกิน 4 MB ต่อรูป ภาพจะถูกจัดเก็บใน Cloudflare R2</small>
        </fieldset></div><div className="admin-save-bar"><button className="admin-btn primary" disabled={busy || uploading}>{uploading ? "กำลังอัปโหลด…" : busy ? "กำลังบันทึก…" : "บันทึกข้อมูล"}</button><button type="button" className="admin-btn subtle" disabled={busy || uploading} onClick={() => setDraft(null)}>ยกเลิก</button></div></form></Dialog.Content></Dialog.Portal></Dialog.Root>);
}
