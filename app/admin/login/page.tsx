import { redirect } from "next/navigation";
import { authConfigured, getSession } from "@/lib/auth";
import { databaseConfigured } from "@/lib/db";
import LoginForm from "@/components/admin/auth/login-form";
export const dynamic = "force-dynamic";
export default async function Login() {
  const ready = databaseConfigured() && await authConfigured();
  if (ready && await getSession()) redirect("/admin");
  return <LoginForm configured={ready} />;
}
