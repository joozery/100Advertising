import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { authConfigured, getSession } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import { getContent } from "@/lib/content";
import AdminFrame from "@/components/admin/admin-frame";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!databaseConfigured() || !await authConfigured()) redirect("/admin/login");
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const content = await getContent();
  return <AdminFrame user={session.user} counts={{ works: content.works.length, services: content.services.length }}>
    {children}
  </AdminFrame>;
}
