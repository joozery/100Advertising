import type { Metadata } from "next";
import "./admin.css";
export const metadata: Metadata = { title: "แอดมิน | 100Advertising", robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) { return <div className="admin-shell">{children}</div>; }
