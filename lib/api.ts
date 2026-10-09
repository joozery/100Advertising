import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./auth";
import { RequestBodyError } from "./request-body";
export function sameOrigin(request: NextRequest) {
  const expected = new URL(process.env.APP_URL || request.url).origin;
  return request.headers.get("origin") === expected;
}
export async function guard(request: NextRequest, adminOnly = false) {
  if (request.method !== "GET" && !sameOrigin(request)) return NextResponse.json({ error: "คำขอไม่ถูกต้อง" }, { status: 403 });
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  if (adminOnly && session.user.role !== "admin") return NextResponse.json({ error: "เฉพาะผู้ดูแลระบบที่จัดการผู้ใช้ได้" }, { status: 403 });
  return null;
}
export function apiError(error: unknown) {
  if (error instanceof RequestBodyError) return NextResponse.json({ error: error.message }, { status: error.status });
  console.error("Admin API failed:", error instanceof Error ? error.name : "Unknown error");
  return NextResponse.json({ error: "ดำเนินการไม่สำเร็จ กรุณาตรวจการเชื่อมต่อและการตั้งค่าระบบ" }, { status: 503 });
}
