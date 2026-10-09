"use client";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { PublicAdminUser } from "@/lib/types";
import { isSettingsSection } from "@/lib/settings-sections";
import AdminSidebar from "./admin-sidebar";
export default function AdminFrame({ children, user, counts }: {
    children: ReactNode;
    user: PublicAdminUser;
    counts: {
        works: number;
        services: number;
    };
}) {
    const pathname = usePathname();
    const section = pathname.split("/")[3] ?? "";
    const active = isSettingsSection(section) ? section : pathname.startsWith("/admin/users") ? "users"
        : pathname.startsWith("/admin/services") ? "services" : "works";
    return <div className="admin-dashboard">
    <AdminSidebar active={active} user={user} counts={counts}/>
    <main className="admin-main">{children}</main>
  </div>;
}
