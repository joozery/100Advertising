import { getContent } from "@/lib/content";
import { r2Configured } from "@/lib/r2";
import ContentManager from "@/components/admin/content/content-manager";

export default async function WorksPage() {
  return <ContentManager initial={await getContent()} uploadReady={r2Configured()} kind="works" />;
}
