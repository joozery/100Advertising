import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/content";
import { r2Configured } from "@/lib/r2";
import { isSettingsSection } from "@/lib/settings-sections";
import SettingsManager from "@/components/admin/settings/settings-manager";
export default async function SettingsPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  if (!isSettingsSection(section)) notFound();
  return <SettingsManager key={section} section={section} initial={await getSiteSettings()} uploadReady={r2Configured()} />;
}
