import "server-only";
import { databaseConfigured, getDb } from "./db";
import { defaultServices, defaultWorks } from "./default-content";
import { defaultSiteSettings } from "./site-settings";
import type { SiteSettings } from "./site-settings";
import type { Content, Service, Work } from "./types";

export async function getContent(): Promise<Content> {
  const db = await getDb();
  const [works, services] = await Promise.all([
    db.collection<Work>("works").find({}, { projection: { _id: 0 } }).sort({ order: 1, id: 1 }).toArray(),
    db.collection<Service>("services").find({}, { projection: { _id: 0 } }).sort({ order: 1, id: 1 }).toArray(),
  ]);
  return { works, services };
}
export async function getPublicContent() {
  const content = databaseConfigured() ? await getContent() : { works: defaultWorks, services: defaultServices };
  const site = databaseConfigured() ? await getSiteSettings() : defaultSiteSettings;
  return { works: content.works.filter(work => work.published), services: content.services.filter(service => service.published), site };
}
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!databaseConfigured()) return defaultSiteSettings;
  const document = await (await getDb()).collection("settings").findOne({ key: "site" });
  return { ...defaultSiteSettings, ...(document?.value ?? {}) };
}
