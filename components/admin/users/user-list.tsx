"use client";
import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import type { PublicAdminUser } from "@/lib/types";
export default function UserList({ visibleUsers, user, search, setSearch, busy, edit, remove }: {
    visibleUsers: PublicAdminUser[];
    user: PublicAdminUser;
    search: string;
    setSearch: (value: string) => void;
    busy: boolean;
    edit: (user: PublicAdminUser) => void;
    remove: (user: PublicAdminUser) => void;
}) { return (<section className="admin-list"><div className="admin-list-toolbar"><input aria-label="ค้นหาผู้ดูแล" placeholder="ค้นหาชื่อหรืออีเมล…" value={search} onChange={e => setSearch(e.target.value)}/></div>{!visibleUsers.length && <div className="admin-empty">ไม่พบสมาชิก</div>}{visibleUsers.map(item => <article className="admin-user-row" key={item.id}><span className="user-avatar">{item.name.slice(0, 1).toUpperCase()}</span><div className="admin-user-info"><h2>{item.name}{item.id === user.id && <span className="user-self">คุณ</span>}</h2><p>{item.email}</p></div><span className={`user-role ${item.role}`}>{item.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้แก้ไขเนื้อหา"}</span><span className={item.enabled ? "admin-badge published" : "admin-badge"}>{item.enabled ? "ใช้งาน" : "ปิดใช้งาน"}</span><div className="admin-row-actions"><button className="admin-icon-btn" aria-label={`แก้ไข ${item.name}`} onClick={() => edit(item)} disabled={busy}><Pencil2Icon /></button><button className="admin-icon-btn danger" aria-label={`ลบ ${item.name}`} disabled={busy || item.primary || item.id === user.id} onClick={() => remove(item)}><TrashIcon /></button></div></article>)}</section>); }
