import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function Admin({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  redirect(params.tab === "services" ? "/admin/services" : "/admin/works");
}
