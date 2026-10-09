import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authConfigured, createSession } from "@/lib/auth";
import { apiError, sameOrigin } from "@/lib/api";
import { databaseConfigured, getDb } from "@/lib/db";
import { verifyPasswordHash } from "@/lib/password";
import type { AdminUser } from "@/lib/types";
import { readJson } from "@/lib/request-body";
const DUMMY_PASSWORD_HASH = `scrypt:${"0".repeat(32)}:${"0".repeat(128)}`;
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "คำขอไม่ถูกต้อง" }, { status: 403 });
    if (!databaseConfigured() || !await authConfigured()) return NextResponse.json({ error: "ระบบยังไม่มีบัญชีผู้ดูแลที่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ" }, { status: 503 });
    const parsed = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(256) }).safeParse(await readJson(request, 4096));
    if (!parsed.success) return NextResponse.json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" }, { status: 400 });
    const db = await getDb();
    const attempts = db.collection<{ _id: string; count: number; expiresAt: Date }>("login_attempts");
    await attempts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    const period = Math.floor(Date.now() / (15 * 60 * 1000));
    const attempt = await attempts.findOneAndUpdate({ _id: `admin-${period}` }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((period + 1) * 15 * 60 * 1000) } }, { upsert: true, returnDocument: "after" });
    if ((attempt?.count ?? 0) > 10) return NextResponse.json({ error: "ลองเข้าสู่ระบบหลายครั้งเกินไป กรุณารอ 15 นาที" }, { status: 429 });
    const user = await db.collection<AdminUser>("admin_users").findOne({ email: parsed.data.email.toLowerCase() });
    const passwordValid = verifyPasswordHash(parsed.data.password, user?.passwordHash || DUMMY_PASSWORD_HASH);
    if (!user || !user.enabled || !passwordValid) return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    await createSession(user);
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
