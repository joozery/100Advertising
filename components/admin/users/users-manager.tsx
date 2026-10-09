"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, PersonIcon } from "@radix-ui/react-icons";
import type { PublicAdminUser } from "@/lib/types";
import type { UserDraft } from "./types";
import UserList from "./user-list";
import UserEditorDialog from "./user-editor-dialog";
export default function UsersManager({ initial, user }: {
    initial: PublicAdminUser[];
    user: PublicAdminUser;
}) {
    const router = useRouter();
    const [users, setUsers] = useState(initial), [draft, setDraft] = useState<UserDraft | null>(null);
    const [busy, setBusy] = useState(false), [error, setError] = useState(""), [notice, setNotice] = useState(""), [search, setSearch] = useState("");
    async function call(url: string, options?: RequestInit) { const response = await fetch(url, options); const result = await response.json(); if (!response.ok)
        throw new Error(result.error || "ดำเนินการไม่สำเร็จ"); return result; }
    async function refresh() { setUsers((await call("/api/admin/users")).users); router.refresh(); }
    function edit(existing?: PublicAdminUser) { setError(""); setNotice(""); setDraft(existing ? { id: existing.id, name: existing.name, email: existing.email, role: existing.role, enabled: existing.enabled, password: "" } : { name: "", email: "", role: "editor", enabled: true, password: "" }); }
    async function save(event: FormEvent) {
        event.preventDefault();
        if (!draft)
            return;
        setBusy(true);
        setError("");
        try {
            const result = await call("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
            if (result.sessionReset) {
                router.replace("/admin/login");
                router.refresh();
                return;
            }
            await refresh();
            setDraft(null);
            setNotice("บันทึกผู้ดูแลเรียบร้อย");
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
        }
        finally {
            setBusy(false);
        }
    }
    async function remove(existing: PublicAdminUser) {
        if (!window.confirm(`ลบบัญชี “${existing.name}” และยกเลิกการเข้าสู่ระบบของบัญชีนี้?`))
            return;
        setBusy(true);
        setError("");
        try {
            await call(`/api/admin/users?id=${encodeURIComponent(existing.id)}`, { method: "DELETE" });
            await refresh();
            setNotice("ลบบัญชีเรียบร้อย");
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "ลบไม่สำเร็จ");
        }
        finally {
            setBusy(false);
        }
    }
    const protectedUser = users.find(item => item.id === draft?.id)?.primary || draft?.id === user.id;
    const visibleUsers = users.filter(item => `${item.name} ${item.email}`.toLowerCase().includes(search.toLowerCase()));
    return <><header className="admin-top"><div><span className="admin-kicker">TEAM & ACCESS</span><h1>ผู้ดูแลระบบ</h1><p>จัดการสมาชิกและสิทธิ์การเข้าถึงหลังบ้าน</p></div><button className="admin-btn primary" onClick={() => edit()} disabled={busy}><PlusIcon /> เพิ่มผู้ดูแล</button></header>
    {error && !draft && <div className="admin-error" role="alert">{error}</div>}{notice && <div className="admin-success" role="status">{notice}</div>}
    <div className="admin-stats"><div><span>สมาชิกทั้งหมด</span><strong>{users.length}</strong></div><div><span>ผู้ดูแลระบบ</span><strong>{users.filter(item => item.role === "admin" && item.enabled).length}</strong></div><div><span>ผู้แก้ไขเนื้อหา</span><strong>{users.filter(item => item.role === "editor").length}</strong></div></div>
    <div className="admin-access-note"><PersonIcon /><div><strong>สิทธิ์การเข้าถึง</strong><p>ผู้ดูแลระบบจัดการเนื้อหาและสมาชิกได้ • ผู้แก้ไขเนื้อหาจัดการผลงานและบริการได้</p></div></div>
    <UserList visibleUsers={visibleUsers} user={user} search={search} setSearch={setSearch} busy={busy} edit={edit} remove={remove}/>
    <p className="admin-hint">บัญชีผู้ดูแลหลักไม่สามารถลบ ปิดใช้งาน หรือลดสิทธิ์ได้ เพื่อให้สามารถเข้าจัดการเว็บไซต์ได้เสมอ</p>
    <UserEditorDialog draft={draft} setDraft={setDraft} busy={busy} protectedUser={Boolean(protectedUser)} error={error} save={save}/>
  </>;
}
