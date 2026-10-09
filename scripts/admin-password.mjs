import { randomBytes, scryptSync, randomUUID } from "node:crypto";
import { loadEnvFile } from "node:process";
import { MongoClient } from "mongodb";
import { createInterface } from "node:readline/promises";
import { Writable } from "node:stream";
try { loadEnvFile(".env.local"); } catch {}
let muted = false;
const output = new Writable({ write(chunk, encoding, callback) { if (!muted) process.stdout.write(chunk, encoding); callback(); } });
const rl = createInterface({ input: process.stdin, output, terminal: Boolean(process.stdin.isTTY) });
let client;
try {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes("YOUR_STRONG_PASSWORD")) throw new Error("Configure MONGODB_URI in .env.local first");
  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error("Invalid email");
  process.stdout.write("Admin password (12+ characters, hidden): "); muted = true;
  const password = await rl.question("");
  muted = false; process.stdout.write("\n");
  if (password.length < 12 || password.length > 256) throw new Error("Password must be 12–256 characters");
  const salt = randomBytes(16).toString("hex");
  const passwordHash = `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  client = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "100ads"), users = db.collection("admin_users");
  await users.createIndex({ id: 1 }, { unique: true });
  await users.createIndex({ email: 1 }, { unique: true });
  const existing = await users.findOne({ email });
  const primary = !await users.findOne({ primary: true });
  const id = existing?.id || (primary ? "primary-admin" : randomUUID());
  await users.updateOne({ id }, { $set: { email, passwordHash, role: "admin", enabled: true }, $setOnInsert: { id, name: primary ? "ผู้ดูแลระบบหลัก" : "ผู้ดูแลระบบ", primary }, $unset: { bootstrapFingerprint: "" } }, { upsert: true });
  await db.collection("sessions").deleteMany({ userId: id });
  process.stdout.write("Admin account saved in MongoDB. No restart required.\n");
} catch (error) { muted = false; process.stderr.write(error instanceof Error && /^(Configure|Invalid|Password)/.test(error.message) ? `${error.message}\n` : "Could not save admin account. Check MongoDB connection.\n"); process.exitCode = 1; }
finally { rl.close(); await client?.close(); }
