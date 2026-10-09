import test from "node:test";
import assert from "node:assert/strict";
import { scryptSync } from "node:crypto";
import sharp from "sharp";
import { workSchema, serviceSchema } from "../lib/validation.ts";
import { hashPassword, verifyPasswordHash } from "../lib/password.ts";
import { normalizeImage } from "../lib/image.ts";
import { readLimitedBody, readJson } from "../lib/request-body.ts";
const work = { id: "work-test", title: "ทดสอบ", subtitle: "ผลงาน", src: "/assets/01.png", images: ["/assets/01.png"], order: 0, published: true };

test("reject empty galleries, dangerous image URLs and unexpected icon values", () => {
  assert.equal(workSchema.safeParse(work).success, true);
  for (const src of ["javascript:alert(1)", "//evil.example/a.jpg", "http://evil.example/a.jpg", "/\\evil.example/a.jpg"]) assert.equal(workSchema.safeParse({ ...work, src }).success, false);
  assert.equal(workSchema.safeParse({ ...work, images: [] }).success, false);
  assert.equal(workSchema.safeParse({ ...work, images: Array(31).fill("/image.jpg") }).success, false);
  assert.equal(serviceSchema.safeParse({ ...work, detail: "บริการ", icon: "unexpected", color: "yellow" }).success, false);
});
test("hash verification denies invalid or wrong passwords", () => {
  const salt = "1234567890abcdef1234567890abcdef";
  const encoded = `scrypt:${salt}:${scryptSync("correct-password", salt, 64).toString("hex")}`;
  assert.equal(verifyPasswordHash("correct-password", encoded), true);
  assert.equal(verifyPasswordHash("wrong-password", encoded), false);
  assert.equal(verifyPasswordHash("correct-password", "invalid"), false);
});
test("admin password creation exports a salted hash compatible with login", () => {
  const password = "test-admin-password";
  const first = hashPassword(password);
  const second = hashPassword(password);
  assert.notEqual(first, second);
  assert.equal(verifyPasswordHash(password, first), true);
  assert.equal(verifyPasswordHash("wrong-password", first), false);
});
test("images are decoded, converted to webp and constrained; SVG and fake images rejected", async () => {
  const source = await sharp({ create: { width: 2600, height: 1300, channels: 3, background: "yellow" } }).png().toBuffer();
  const result = await normalizeImage(source);
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.format, "webp"); assert.equal(metadata.width, 2400); assert.equal(metadata.height, 1200);
  await assert.rejects(normalizeImage(Buffer.from("not an image")));
  await assert.rejects(normalizeImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>')));
});

test("request size limits apply even without a content-length header", async () => {
  const request = new Request("https://example.test", { method: "POST", body: new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(1024)); controller.enqueue(new Uint8Array(1024)); controller.close(); } }), duplex: "half" });
  await assert.rejects(readLimitedBody(request, 1500), error => error.status === 413);
  await assert.rejects(readJson(new Request("https://example.test", { method: "POST", body: "invalid" }), 100), error => error.status === 400);
});

test("site settings defaults validate and reject unsafe links or invalid process data", async () => {
  const { siteSettingsSchema } = await import("../lib/validation.ts");
  const { defaultSiteSettings } = await import("../lib/site-settings.ts");
  assert.equal(siteSettingsSchema.safeParse(defaultSiteSettings).success, true);
  assert.equal(siteSettingsSchema.safeParse({ ...defaultSiteSettings, facebookUrl: "https://facebook.com.evil.test" }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...defaultSiteSettings, heroImage: "javascript:alert(1)" }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...defaultSiteSettings, navLabels: ["one"] }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...defaultSiteSettings, steps: [] }).success, false);
  assert.equal(siteSettingsSchema.safeParse({ ...defaultSiteSettings, steps: [{ ...defaultSiteSettings.steps[0], icon: "unknown" }] }).success, false);
});
