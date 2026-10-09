import { NextRequest, NextResponse } from "next/server";
import { guard, apiError } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { listAdminUsers, newUserId } from "@/lib/admin-users";
import { hashPassword } from "@/lib/password";
import { readJson } from "@/lib/request-body";
import { adminUserSchema } from "@/lib/user-validation";
import type { AdminUser } from "@/lib/types";
export async function GET(request: NextRequest) {
  try { const blocked = await guard(request, true); if (blocked) return blocked; return NextResponse.json({ users: await listAdminUsers() }, { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: NextRequest) {
  try {
    const blocked = await guard(request, true); if (blocked) return blocked;
    const parsed = adminUserSchema.safeParse(await readJson(request, 8000));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const data = parsed.data;
    const db = await getDb(), users = db.collection<AdminUser>("admin_users");
    const session = await getSession();
    const existing = data.id ? await users.findOne({ id: data.id }) : null;
    if (data.id && !existing) return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    if (!existing && !data.password) return NextResponse.json({ error: "กรุณาตั้งรหัสผ่านสำหรับผู้ใช้ใหม่" }, { status: 400 });
    if ((existing?.primary || existing?.id === session?.user.id) && (!data.enabled || data.role !== "admin")) return NextResponse.json({ error: "ไม่สามารถปิดสิทธิ์ผู้ดูแลหลักหรือบัญชีของตนเอง" }, { status: 400 });
    const update = { name: data.name, email: data.email, role: data.role, enabled: data.enabled, ...(data.password ? { passwordHash: hashPassword(data.password) } : {}) };
    if (existing) await users.updateOne({ id: existing.id }, { $set: update });
    else await users.insertOne({ id: newUserId(), name: data.name, email: data.email, role: data.role, enabled: data.enabled, primary: false, passwordHash: hashPassword(data.password!) });
    return NextResponse.json({ ok: true, sessionReset: existing?.id === session?.user.id && Boolean(data.password) });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) return NextResponse.json({ error: "อีเมลนี้มีผู้ใช้แล้ว" }, { status: 409 });
    return apiError(error);
  }
}
export async function DELETE(request: NextRequest) {
  try {
    const blocked = await guard(request, true); if (blocked) return blocked;
    const id = request.nextUrl.searchParams.get("id");
    if (!id || !/^[a-zA-Z0-9-]{1,80}$/.test(id)) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    const db = await getDb(), user = await db.collection<AdminUser>("admin_users").findOne({ id });
    const session = await getSession();
    if (!user) return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    if (user.primary || user.id === session?.user.id) return NextResponse.json({ error: "ไม่สามารถลบบัญชีผู้ดูแลหลักหรือบัญชีของตนเอง" }, { status: 400 });
    await db.collection("admin_users").deleteOne({ id, primary: false });
    await db.collection("sessions").deleteMany({ userId: id });
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
