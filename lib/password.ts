import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
export function verifyPasswordHash(password: string, encoded: string) {
  if (!/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(encoded) || password.length > 256) return false;
  const [, salt, expected] = encoded.split(":");
  const actual = scryptSync(password, salt, 64);
  return timingSafeEqual(actual, Buffer.from(expected, "hex"));
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
