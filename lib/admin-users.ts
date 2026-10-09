import "server-only";
import { randomUUID } from "node:crypto";
import { getDb } from "./db";
import type { AdminUser } from "./types";
export function publicUser(user: AdminUser) {
  return { id: user.id, name: user.name, email: user.email, role: user.role, enabled: user.enabled, primary: user.primary };
}
export async function listAdminUsers() {
  return (await (await getDb()).collection<AdminUser>("admin_users").find().sort({ primary: -1, name: 1 }).toArray()).map(publicUser);
}
export const newUserId = () => randomUUID();
