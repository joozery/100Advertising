import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guard, apiError } from "@/lib/api";
import { getContent } from "@/lib/content";
import { getDb } from "@/lib/db";
import { workSchema, serviceSchema } from "@/lib/validation";
import { readJson } from "@/lib/request-body";
function kind(request: NextRequest) { const value = request.nextUrl.searchParams.get("kind"); return value === "works" || value === "services" ? value : null; }
export async function GET(request: NextRequest) {
  try {
    const blocked = await guard(request); if (blocked) return blocked;
    return NextResponse.json(await getContent(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return apiError(error); }
}
export async function PUT(request: NextRequest) {
  try {
    const blocked = await guard(request); if (blocked) return blocked;
    const collection = kind(request);
    if (!collection) return NextResponse.json({ error: "ประเภทข้อมูลไม่ถูกต้อง" }, { status: 400 });
    const parsed = (collection === "works" ? workSchema : serviceSchema).safeParse(await readJson(request, 100000));
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const db = await getDb();
    await db.collection(collection).updateOne({ id: parsed.data.id }, { $set: parsed.data, $setOnInsert: { createdAt: new Date() }, $currentDate: { updatedAt: true } }, { upsert: true });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    const blocked = await guard(request); if (blocked) return blocked;
    const collection = kind(request), id = request.nextUrl.searchParams.get("id");
    if (!collection || !id || !/^[a-zA-Z0-9-]{1,80}$/.test(id)) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    const db = await getDb();
    await db.collection(collection).deleteOne({ id });
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
