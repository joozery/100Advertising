import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { listAdminUsers } from "@/lib/admin-users";
import UsersManager from "@/components/admin/users/users-manager";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/admin/works");
  return <UsersManager initial={await listAdminUsers()} user={session.user} />;
}
