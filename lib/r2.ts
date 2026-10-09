import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import { normalizeImage } from "./image";
export function r2Configured() { return Boolean(process.env.R2_ACCOUNT_ID && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY && process.env.R2_BUCKET_NAME && process.env.R2_PUBLIC_URL); }
export async function uploadImage(file: File) {
  if (!r2Configured()) throw new Error("R2 is not configured");
  const publicUrl = new URL(process.env.R2_PUBLIC_URL!);
  if (publicUrl.protocol !== "https:") throw new Error("R2 public URL must use HTTPS");
  const bytes = Buffer.from(await file.arrayBuffer());
  const output = await normalizeImage(bytes);
  const key = `images/${randomUUID()}.webp`;
  const client = new S3Client({ region: "auto", endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! } });
  await client.send(new PutObjectCommand({ Bucket: process.env.R2_BUCKET_NAME!, Key: key, Body: output, ContentType: "image/webp", CacheControl: "public, max-age=31536000, immutable" }));
  return `${publicUrl.toString().replace(/\/$/, "")}/${key}`;
}
