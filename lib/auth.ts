import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { getDb } from "./db";
import { databaseConfigured } from "./db";
import { publicUser } from "./admin-users";
import type { AdminUser } from "./types";
export const SESSION_COOKIE = "advertising_admin";
const hash = (value: string) => createHash("sha256").update(value).digest("hex");
export async function authConfigured() {
  if (!databaseConfigured()) return false;
  try { return Boolean(await (await getDb()).collection<AdminUser>("admin_users").findOne({ role: "admin", enabled: true }, { projection: { _id: 1 } })); }
  catch { return false; }
}
export async function getSession() {
  if (!databaseConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const db = await getDb();
  const session = await db.collection("sessions").findOne({ tokenHash: hash(token), expiresAt: { $gt: new Date() } });
  if (!session) return null;
  const user = await db.collection<AdminUser>("admin_users").findOne(session.userId ? { id: session.userId } : { email: String(session.email).toLowerCase() });
  if (!user || !user.enabled || hash(user.passwordHash) !== session.credentialVersion) return null;
  return { user: publicUser(user), expiresAt: session.expiresAt };
}
export async function createSession(user: AdminUser) {
  const db = await getDb();
  await db.collection("sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  const token = randomBytes(32).toString("hex");
  await db.collection("sessions").insertOne({ tokenHash: hash(token), userId: user.id, email: user.email, credentialVersion: hash(user.passwordHash), expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) });
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 60 * 60 });
}
export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await (await getDb()).collection("sessions").deleteOne({ tokenHash: hash(token) });
  jar.delete(SESSION_COOKIE);
}
