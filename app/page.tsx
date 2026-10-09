import LandingPage from "@/components/landing-page";
import { getPublicContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { services, works, site } = await getPublicContent();
  return <LandingPage services={services} works={works} site={site} />;
}
