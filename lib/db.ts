import "server-only";
import { MongoClient } from "mongodb";

const cache = globalThis as typeof globalThis & { advertisingMongo?: Promise<MongoClient> };
export function databaseConfigured() {
  const uri = process.env.MONGODB_URI;
  return Boolean(uri && !uri.includes("YOUR_STRONG_PASSWORD"));
}
export async function getDb() {
  if (!databaseConfigured()) throw new Error("กรุณาตั้งค่า MONGODB_URI ด้วยรหัสผ่านจริงใน .env.local");
  if (!cache.advertisingMongo) {
    const client = new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 5000 });
    cache.advertisingMongo = client.connect().catch(error => { cache.advertisingMongo = undefined; throw error; });
  }
  return (await cache.advertisingMongo).db(process.env.MONGODB_DB || "100ads");
}
