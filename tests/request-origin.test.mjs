import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedRequestOrigin } from "../lib/request-origin.ts";

test("same-site deployment works with a stale localhost APP_URL", () => {
  assert.equal(isAllowedRequestOrigin("https://100ads.vercel.app/api/admin/auth/login", "https://100ads.vercel.app", { appUrl: "http://localhost:3000", production: true }), true);
  assert.equal(isAllowedRequestOrigin("http://localhost:3000/api/admin/auth/login", "http://localhost:3000"), true);
});
test("explicit Vercel project domains work behind an internal request URL", () => {
  const config = { production: true, deploymentUrl: "100ads-abc.vercel.app", branchUrl: "100ads-git-main.vercel.app", productionUrl: "100ads.example", appUrl: "https://www.100ads.example" };
  for (const origin of ["https://100ads-abc.vercel.app", "https://100ads-git-main.vercel.app", "https://100ads.example", "https://www.100ads.example"]) assert.equal(isAllowedRequestOrigin("http://localhost:3000/api/admin/content", origin, config), true);
});
test("untrusted, missing, malformed and insecure production origins are denied", () => {
  const config = { production: true, appUrl: "http://localhost:3000", deploymentUrl: "100ads.vercel.app" };
  for (const origin of [null, "null", "https://evil.vercel.app", "https://100ads.vercel.app.evil.test", "https://100ads.vercel.app/path", "https://user@100ads.vercel.app", "http://localhost:3000", "http://100ads.vercel.app"]) assert.equal(isAllowedRequestOrigin("https://100ads.vercel.app/api/admin/content", origin, config), false);
  assert.equal(isAllowedRequestOrigin("https://100ads.vercel.app/api/admin/content", "https://100ads.vercel.app", { ...config, appUrl: "not-a-url" }), true);
});
