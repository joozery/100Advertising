import { NextRequest, NextResponse } from "next/server";
import { guard, apiError } from "@/lib/api";
import { r2Configured, uploadImage } from "@/lib/r2";
import { readLimitedBody, RequestBodyError } from "@/lib/request-body";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const blocked = await guard(request); if (blocked) return blocked;
    if (!r2Configured()) return NextResponse.json({ error: "กรุณาตั้งค่า Cloudflare R2 ใน .env.local ก่อนอัปโหลด" }, { status: 503 });
    const bytes = await readLimitedBody(request, Math.ceil(4.2 * 1024 * 1024));
    let form: FormData;
    try { form = await new Response(bytes, { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData(); }
    catch { throw new RequestBodyError("รูปแบบไฟล์อัปโหลดไม่ถูกต้อง"); }
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 4 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) return NextResponse.json({ error: "รองรับ JPG, PNG, WebP ขนาดไม่เกิน 4 MB" }, { status: 400 });
    try { return NextResponse.json({ url: await uploadImage(file) }); }
    catch (error) { return apiError(error); }
  } catch (error) { return apiError(error); }
}
