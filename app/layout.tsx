import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@fontsource-variable/noto-sans-thai";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: { url: "/browser.png", type: "image/png" },
    apple: "/browser.png",
  },
  title: "100 เรื่องราว Advertising | ป้ายโฆษณาและงานพิมพ์ครบวงจร",
  description: "ออกแบบ ผลิต และติดตั้งป้ายโฆษณา งานพิมพ์ไวนิล สติ๊กเกอร์ และกราฟิก ดูแลครบทุกขั้นตอนโดยทีมงานมืออาชีพ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body style={{ position: "relative" }}>
        <Theme accentColor="yellow" radius="large">{children}</Theme>
      </body>
    </html>
  );
}
