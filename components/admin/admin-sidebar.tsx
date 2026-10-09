"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageIcon, DashboardIcon, PersonIcon, ExternalLinkIcon, ExitIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { settingsSections, type SettingsSection } from "@/lib/settings-sections";
import type { ContentKind, PublicAdminUser } from "@/lib/types";
export default function AdminSidebar({ active, user, counts, disabled = false }: {
    active: ContentKind | "users" | SettingsSection;
    user: PublicAdminUser;
    counts?: {
        works: number;
        services: number;
    };
    disabled?: boolean;
}) {
    const router = useRouter();
    const [busy, setBusy] = useState(false), [error, setError] = useState("");
    async function logout() {
        setBusy(true);
        setError("");
        try {
            const response = await fetch("/api/admin/auth/logout", { method: "POST" });
            if (!response.ok)
                throw new Error();
            router.replace("/admin/login");
            router.refresh();
        }
        catch {
            setError("ออกจากระบบไม่สำเร็จ");
            setBusy(false);
        }
    }
    const navItem = (kind: ContentKind, title: string, icon: React.ReactNode) => <Link aria-current={active === kind ? "page" : undefined} className={active === kind ? "selected" : ""} href={`/admin/${kind}`}>{icon}<span className="sidebar-nav-label">{title}</span><span className="sidebar-count">{counts?.[kind]}</span><ChevronRightIcon /></Link>;
    return <aside className="admin-sidebar">
    <Link href="/admin" className="admin-logo"><Image src="/logo.png" alt="100Advertising" width={220} height={79}/></Link>
    <div className="sidebar-group-title">จัดการเนื้อหา</div><nav aria-label="เมนูหลังบ้าน">{navItem("works", "ผลงานและแกลเลอรี", <ImageIcon />)}{navItem("services", "บริการของเรา", <DashboardIcon />)}</nav>
    <div className="sidebar-group-title">จัดการเว็บไซต์</div><nav aria-label="จัดการเว็บไซต์">{Object.entries(settingsSections).map(([key, section]) => <Link key={key} href={`/admin/settings/${key}`} aria-current={active === key ? "page" : undefined} className={active === key ? "selected" : ""}><DashboardIcon /><span className="sidebar-nav-label">{section.title}</span><ChevronRightIcon /></Link>)}</nav>
    {user.role === "admin" && <><div className="sidebar-group-title">ตั้งค่าระบบ</div><nav aria-label="ตั้งค่าระบบ"><Link href="/admin/users" className={active === "users" ? "selected" : ""}><PersonIcon /><span className="sidebar-nav-label">ผู้ดูแลระบบ</span><ChevronRightIcon /></Link></nav></>}
    <div className="admin-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer" className="sidebar-site-link"><ExternalLinkIcon /> เปิดหน้าเว็บไซต์ <ChevronRightIcon /></a><div className="sidebar-profile"><span className="sidebar-avatar">{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.role === "admin" ? "ผู้ดูแลระบบ" : "ผู้แก้ไขเนื้อหา"}</small></div><button aria-label="ออกจากระบบ" onClick={logout} disabled={busy || disabled}><ExitIcon /></button></div>{error && <p className="sidebar-error" role="alert">{error}</p>}<p className="sidebar-credit">CMS by <strong>Wooyou Creative</strong><span>สร้างสรรค์ทุกไอเดียให้เป็นจริง</span></p></div>
  </aside>;
}
