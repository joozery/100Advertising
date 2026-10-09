import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth";
import { sameOrigin, apiError } from "@/lib/api";
export async function POST(request: NextRequest) {
  try {
    if (!sameOrigin(request)) return NextResponse.json({ error: "คำขอไม่ถูกต้อง" }, { status: 403 });
    await deleteSession();
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
