import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guard, apiError } from "@/lib/api";
import { getSiteSettings } from "@/lib/content";
import { getDb } from "@/lib/db";
import { readJson } from "@/lib/request-body";
import { siteSettingsSchema } from "@/lib/validation";
import { isSettingsSection, settingsSections } from "@/lib/settings-sections";
export async function GET(request: NextRequest) {
  try { const blocked = await guard(request); if (blocked) return blocked; return NextResponse.json(await getSiteSettings(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) { return apiError(error); }
}
export async function PUT(request: NextRequest) {
  try {
    const blocked = await guard(request); if (blocked) return blocked;
    const section = request.nextUrl.searchParams.get("section") ?? "";
    if (!isSettingsSection(section)) return NextResponse.json({ error: "ส่วนที่แก้ไขไม่ถูกต้อง" }, { status: 400 });
    const body = await readJson(request, 50000);
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "ข้อมูลไม่ถูกต้อง" }, { status: 400 });
    const keys = settingsSections[section].fields.map(field => field.key);
    const selected = Object.fromEntries(keys.map(key => [key, (body as Record<string, unknown>)[key]]));
    const parsed = siteSettingsSchema.safeParse({ ...await getSiteSettings(), ...selected });
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const update = Object.fromEntries(keys.map(key => [`value.${key}`, parsed.data[key]]));
    await (await getDb()).collection("settings").updateOne({ key: "site" }, { $set: update, $currentDate: { updatedAt: true } }, { upsert: true });
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) { return apiError(error); }
}
