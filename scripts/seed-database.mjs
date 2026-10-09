import { loadEnvFile } from "node:process";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { MongoClient } from "mongodb";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defaultWorks, defaultServices } from "../lib/default-content.ts";
import { defaultSiteSettings } from "../lib/site-settings.ts";
import { normalizeImage } from "../lib/image.ts";

loadEnvFile(".env.local");
for (const key of ["MONGODB_URI", "R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET_NAME", "R2_PUBLIC_URL"]) if (!process.env[key]) throw new Error(`${key} is required`);
const mongo = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
const r2 = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY }, maxAttempts: 2 });
const publicBase = process.env.R2_PUBLIC_URL.replace(/\/$/, "");
const mapping = new Map();
const publicDir = path.resolve("public");
async function migrateImage(source) {
  if (!source.startsWith("/") || source.startsWith("//")) return source;
  if (mapping.has(source)) return mapping.get(source);
  const file = path.resolve(publicDir, source.slice(1));
  if (!file.startsWith(publicDir + path.sep)) throw new Error("Invalid local image path");
  const output = await normalizeImage(await readFile(file));
  const digest = createHash("sha256").update(output).digest("hex");
  const key = `images/seed/${digest}.webp`;
  await r2.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME, Key: key, Body: output, ContentType: "image/webp", CacheControl: "public, max-age=31536000, immutable" }));
  const url = `${publicBase}/${key}`;
  const response = await fetch(url); if (!response.ok) throw new Error(`Public image check failed: ${response.status}`);
  await response.arrayBuffer();
  mapping.set(source, url);
  console.log(`Uploaded ${path.basename(file)}`);
  return url;
}
try {
  await mongo.connect();
  const db = mongo.db(process.env.MONGODB_DB || "100ads");
  const [works, services, settings] = await Promise.all([db.collection("works").find().toArray(), db.collection("services").find().toArray(), db.collection("settings").find().toArray()]);
  await mkdir(".seed-backups", { recursive: true });
  await writeFile(`.seed-backups/content-${Date.now()}.json`, JSON.stringify({ works, services, settings }, null, 2), { mode: 0o600 });
  // Preserve current edited content; starter records fill only missing IDs.
  const mergedWorks = [...works, ...defaultWorks.filter(item => !works.some(existing => existing.id === item.id))];
  const mergedServices = [...services, ...defaultServices.filter(item => !services.some(existing => existing.id === item.id))];
  const nextWorks = [];
  for (const item of mergedWorks) {
    const record = { ...item }; delete record._id;
    nextWorks.push({ ...record, src: await migrateImage(record.src), images: await Promise.all(record.images.map(migrateImage)) });
  }
  const nextServices = [];
  for (const item of mergedServices) {
    const record = { ...item }; delete record._id;
    nextServices.push({ ...record, src: await migrateImage(record.src) });
  }
  const site = { ...defaultSiteSettings, ...(settings.find(item => item.key === "site")?.value ?? {}) };
  for (const key of ["logo", "browserIcon", "heroImage", "qrImage"]) site[key] = await migrateImage(site[key]);
  // Upload and verify every image before changing references in MongoDB.
  await db.collection("works").bulkWrite(nextWorks.map(item => ({ updateOne: { filter: { id: item.id }, update: { $set: item, $currentDate: { updatedAt: true } }, upsert: true } })));
  await db.collection("services").bulkWrite(nextServices.map(item => ({ updateOne: { filter: { id: item.id }, update: { $set: item, $currentDate: { updatedAt: true } }, upsert: true } })));
  await db.collection("settings").updateOne({ key: "site" }, { $set: { value: site }, $currentDate: { updatedAt: true } }, { upsert: true });
  await db.collection("settings").updateOne({ key: "initialized" }, { $set: { value: true } }, { upsert: true });
  await db.collection("works").createIndex({ id: 1 }, { unique: true });
  await db.collection("services").createIndex({ id: 1 }, { unique: true });
  const savedWorks = await db.collection("works").find().toArray(), savedServices = await db.collection("services").find().toArray();
  const allImages = [...savedWorks.flatMap(item => [item.src, ...item.images]), ...savedServices.map(item => item.src), ...["logo", "browserIcon", "heroImage", "qrImage"].map(key => site[key])];
  if (allImages.some(url => !url.startsWith(publicBase + "/"))) throw new Error("Some images are not on the configured R2 public domain");
  console.log(`Seed complete: ${savedWorks.length} works, ${savedServices.length} services, site settings; ${mapping.size} local images uploaded. All image references verified.`);
} catch (error) {
  console.error("Seed failed:", error.name, error.code || ""); process.exitCode = 1;
} finally { await mongo.close(); r2.destroy(); }
