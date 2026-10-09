export type SiteSettings = {
  logo: string; browserIcon: string; heroImage: string; qrImage: string;
  phone: string; lineId: string; facebookUrl: string;
  heroEyebrow: string; heroHeadline: [string, string, string]; heroDescription: string;
  contactHeadline: string; contactDescription: string;
  navLabels: [string, string, string, string, string];
  quoteLabel: string; heroPrimaryLabel: string; heroSecondaryLabel: string;
  qrTitle: string; qrDescription: string; contactButtonLabel: string;
  servicesEyebrow: string; servicesTitle: string; servicesSubtitle: string; servicesDescription: string;
  worksEyebrow: string; worksTitle: string; worksSubtitle: string;
  processEyebrow: string; processTitle: string; processSubtitle: string;
  steps: { title: string; detail: string; icon: "chat" | "document" | "gear" | "check"; color: "yellow" | "pink" | "cyan" }[];
};
export const defaultSiteSettings: SiteSettings = {
  navLabels: ["หน้าแรก", "บริการ", "ผลงาน", "ขั้นตอนการทำงาน", "ติดต่อเรา"],
  quoteLabel: "ขอใบเสนอราคา", heroPrimaryLabel: "ปรึกษางานกับเรา", heroSecondaryLabel: "ดูผลงาน",
  qrTitle: "สแกนเพื่อติดต่อเรา", qrDescription: "หรือแตะเพื่อแชท LINE", contactButtonLabel: "ปรึกษาและขอราคา",
  servicesEyebrow: "OUR SERVICES", servicesTitle: "บริการของเรา", servicesSubtitle: "งานโฆษณาครบวงจร ตอบโจทย์ทุกธุรกิจ",
  servicesDescription: "เราพร้อมให้บริการงานป้ายและสื่อโฆษณาทุกรูปแบบ\nด้วยวัสดุคุณภาพสูง ทีมงานมืออาชีพ และงานติดตั้งที่ได้มาตรฐาน",
  worksEyebrow: "OUR WORK", worksTitle: "ผลงานของเรา", worksSubtitle: "ตัวอย่างงานจริง จากหลากหลายธุรกิจ",
  processEyebrow: "OUR PROCESS", processTitle: "ขั้นตอนการทำงาน", processSubtitle: "ดูแลทุกขั้นตอน ตั้งแต่ต้นจนจบ",
  steps: [
    { title: "ปรึกษา / แจ้งความต้องการ", detail: "พูดคุยรายละเอียดงาน\nรับคำแนะนำจากทีมงาน", icon: "chat", color: "yellow" },
    { title: "ออกแบบและเสนอราคา", detail: "ออกแบบตามความต้องการ\nพร้อมเสนอราคา", icon: "document", color: "pink" },
    { title: "ผลิตงาน", detail: "ผลิตด้วยวัสดุคุณภาพ\nได้มาตรฐาน", icon: "gear", color: "cyan" },
    { title: "ติดตั้งหน้างาน", detail: "ทีมงานติดตั้งอย่างมืออาชีพ\nดูแลครบจบงาน", icon: "check", color: "yellow" },
  ],
  logo: "/logo.png", browserIcon: "/browser.png", heroImage: "/assets/cover.png", qrImage: "/assets/qrcode.jpg",
  phone: "097-2828232", lineId: "100storiess", facebookUrl: "https://www.facebook.com/100storiess",
  heroEyebrow: "ป้ายโฆษณา ไวนิล สติ๊กเกอร์ ตู้ไฟ และงานพิมพ์ครบวงจร",
  heroHeadline: ["เปลี่ยนทุกไอเดีย", "ให้เป็นงานโฆษณา", "ที่โดดเด่น"],
  heroDescription: "เราคือทีมงานที่พร้อมดูแลทุกงานโฆษณา\nตั้งแต่การออกแบบ ผลิต ติดตั้ง ด้วยคุณภาพ\nและความใส่ใจในทุกรายละเอียด",
  contactHeadline: "ให้เราเป็นส่วนหนึ่ง\nในการสร้างแบรนด์ของคุณ",
  contactDescription: "งานโฆษณาคุณภาพ ในราคาที่เหมาะสม\nติดต่อเราได้เลยวันนี้",
};
