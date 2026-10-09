"use client";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { UserDraft } from "./types";
export default function UserEditorDialog({ draft, setDraft, busy, protectedUser, error, save }: {
    draft: UserDraft | null;
    setDraft: Dispatch<SetStateAction<UserDraft | null>>;
    busy: boolean;
    protectedUser: boolean;
    error: string;
    save: (event: FormEvent) => void;
}) { return (<Dialog.Root open={draft !== null} onOpenChange={open => { if (!open && !busy)
    setDraft(null); }}><Dialog.Portal><Dialog.Overlay className="dialog-overlay"/><Dialog.Content className="admin-user-dialog" onEscapeKeyDown={event => { if (busy)
    event.preventDefault(); }} onPointerDownOutside={event => { if (busy)
    event.preventDefault(); }}><div className="admin-editor-heading"><Dialog.Title>{draft?.id ? "แก้ไขผู้ดูแล" : "เพิ่มผู้ดูแลใหม่"}</Dialog.Title><Dialog.Close asChild><button className="admin-icon-btn" aria-label="ปิด" disabled={busy}><Cross2Icon /></button></Dialog.Close></div><Dialog.Description className="admin-hint">ตั้งชื่อ อีเมล และสิทธิ์การเข้าถึงของสมาชิก</Dialog.Description>{draft && <form onSubmit={save}><fieldset disabled={busy}><label>ชื่อผู้ดูแล<input required maxLength={120} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })}/></label><label>อีเมล<input type="email" autoComplete="off" required maxLength={254} value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })}/></label><div className="admin-form-grid"><label>สิทธิ์<select value={draft.role} disabled={protectedUser} onChange={e => setDraft({ ...draft, role: e.target.value as "admin" | "editor" })}><option value="editor">ผู้แก้ไขเนื้อหา</option><option value="admin">ผู้ดูแลระบบ</option></select></label><label>สถานะ<select value={draft.enabled ? "enabled" : "disabled"} disabled={protectedUser} onChange={e => setDraft({ ...draft, enabled: e.target.value === "enabled" })}><option value="enabled">ใช้งาน</option><option value="disabled">ปิดใช้งาน</option></select></label></div><label>{draft.id ? "รหัสผ่านใหม่ (เว้นว่างเพื่อใช้รหัสเดิม)" : "รหัสผ่าน"}<input type="password" autoComplete="new-password" minLength={12} maxLength={256} required={!draft.id} value={draft.password} onChange={e => setDraft({ ...draft, password: e.target.value })}/></label><small className="admin-hint">รหัสผ่านอย่างน้อย 12 ตัว เปลี่ยนรหัสแล้ว session เดิมจะถูกยกเลิก</small></fieldset>{error && <div className="admin-error" role="alert">{error}</div>}<div className="admin-save-bar"><button className="admin-btn primary" disabled={busy}>{busy ? "กำลังบันทึก…" : "บันทึกผู้ดูแล"}</button><button type="button" className="admin-btn subtle" onClick={() => setDraft(null)} disabled={busy}>ยกเลิก</button></div></form>}</Dialog.Content></Dialog.Portal></Dialog.Root>); }
