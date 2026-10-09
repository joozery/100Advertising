import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("all locked packages have a version npm can resolve", async () => {
  const lock = JSON.parse(await readFile(new URL("../package-lock.json", import.meta.url), "utf8"));
  for (const [path, metadata] of Object.entries(lock.packages)) {
    if (!path || metadata.link) continue;
    assert.match(metadata.version ?? "", /^\d+\.\d+\.\d+(?:[-+][\da-zA-Z.+-]+)?$/, `${path} has a missing or invalid version`);
  }
});
