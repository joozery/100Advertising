import type { Service, Work } from "./types";

export const defaultServices: Service[] = [
  { id: "service-1", order: 0, published: true, title: "ป้ายโฆษณา", detail: "ป้ายหน้าร้าน ป้ายกล่องไฟ ป้ายตัวอักษร ป้ายอะคริลิค ป้ายไวนิล ฯลฯ", icon: "sign", color: "yellow", src: "/service/brand.png" },
  { id: "service-2", order: 1, published: true, title: "งานพิมพ์ไวนิล", detail: "ไวนิล สติ๊กเกอร์ พลาสวูด แผ่นพิมพ์แคนวาส งานพิมพ์คุณภาพสูง", icon: "print", color: "pink", src: "/service/winiw.png" },
  { id: "service-3", order: 2, published: true, title: "สติ๊กเกอร์", detail: "สติ๊กเกอร์ไดคัท สติ๊กเกอร์ฉลากสินค้า สติ๊กเกอร์ PVC กระดาษ / กันน้ำ ฯลฯ", icon: "sticker", color: "cyan", src: "/service/sticker.png" },
  { id: "service-4", order: 3, published: true, title: "ออกแบบกราฟิก", detail: "ออกแบบป้าย โลโก้ สื่อโฆษณา อาร์ตเวิร์ก พร้อมผลิตและติดตั้ง", icon: "design", color: "black", src: "/service/graphic.png" },
];
export const defaultWorks: Work[] = [
  { id: "work-1", order: 0, published: true, title: "ป้ายร้านมิสเตอร์ฟรองซ์", subtitle: "งานป้ายหน้าร้านมิสเตอร์ฟรองซ์ ทะเลดอง", src: "/assets/mrfrong.jpg", images: ["/assets/mrfrong.jpg"] },
  { id: "work-2", order: 1, published: true, title: "ป้ายกล่องไฟ Yello!", subtitle: "งานป้ายเมนูและป้ายโปรโมชั่นร้าน Yello!", src: "/assets/yello.jpg", images: ["/assets/yello.jpg"] },
  { id: "work-3", order: 2, published: true, title: "ป้ายร้านโมจิ", subtitle: "ป้ายไฟร้านนวดเพื่อสุขภาพ", src: "/assets/01.png", images: ["/assets/01.png", "/assets/02.jpg"] },
  { id: "work-4", order: 3, published: true, title: "งานสติ๊กเกอร์", subtitle: "ตัวอย่างผลงานสติ๊กเกอร์", src: "/assets/สติกเกอ.png", images: ["/assets/สติกเกอ.png"] },
  { id: "work-5", order: 4, published: true, title: "ป้ายและงานพิมพ์", subtitle: "ป้าย 100 เรื่องราว Advertising และพื้นที่งานพิมพ์", src: "/assets/829496059_1758986729360819_9209155475496199215_n.jpg", images: ["/assets/829496059_1758986729360819_9209155475496199215_n.jpg"] },
  { id: "work-6", order: 5, published: true, title: "ป้ายสถานีชาร์จ EV", subtitle: "ป้ายไฟ EV Station Route 11 และ OneCharge", src: "/assets/สถานีชาร์จ EV เรืองแสงยามค่ำคืน.png", images: ["/assets/สถานีชาร์จ EV เรืองแสงยามค่ำคืน.png"] },
];
