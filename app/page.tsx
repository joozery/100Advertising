"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import { DesktopIcon, ImageIcon, LayersIcon, Pencil2Icon, ChevronUpIcon, ChevronLeftIcon, PlayIcon, ChevronRightIcon, Cross2Icon, HamburgerMenuIcon, ChatBubbleIcon, FileTextIcon, GearIcon, CheckCircledIcon, MobileIcon } from "@radix-ui/react-icons";

const services = [
  { title: "ป้ายโฆษณา", detail: "ป้ายหน้าร้าน ป้ายกล่องไฟ ป้ายตัวอักษร ป้ายอะคริลิค ป้ายไวนิล ฯลฯ", icon: DesktopIcon, color: "yellow", src: "/service/brand.png" },
  { title: "งานพิมพ์ไวนิล", detail: "ไวนิล สติ๊กเกอร์ พลาสวูด แผ่นพิมพ์แคนวาส งานพิมพ์คุณภาพสูง", icon: ImageIcon, color: "pink", src: "/service/winiw.png" },
  { title: "สติ๊กเกอร์", detail: "สติ๊กเกอร์ไดคัท สติ๊กเกอร์ฉลากสินค้า สติ๊กเกอร์ PVC กระดาษ / กันน้ำ ฯลฯ", icon: LayersIcon, color: "cyan", src: "/service/sticker.png" },
  { title: "ออกแบบกราฟิก", detail: "ออกแบบป้าย โลโก้ สื่อโฆษณา อาร์ตเวิร์ก พร้อมผลิตและติดตั้ง", icon: Pencil2Icon, color: "black", src: "/service/graphic.png" },
];
const works = [
  { title: "ป้ายร้านมิสเตอร์ฟรองซ์", subtitle: "งานป้ายหน้าร้านมิสเตอร์ฟรองซ์ ทะเลดอง", src: "/assets/mrfrong.jpg", images: ["/assets/mrfrong.jpg"] },
  { title: "ป้ายกล่องไฟ Yello!", subtitle: "งานป้ายเมนูและป้ายโปรโมชั่นร้าน Yello!", src: "/assets/yello.jpg", images: ["/assets/yello.jpg"] },
  { title: "ป้ายร้านโมจิ", subtitle: "ป้ายไฟร้านนวดเพื่อสุขภาพ", src: "/assets/01.png", images: ["/assets/01.png", "/assets/02.jpg"] },
  { title: "งานสติ๊กเกอร์", subtitle: "ตัวอย่างผลงานสติ๊กเกอร์", src: "/assets/สติกเกอ.png", images: ["/assets/สติกเกอ.png"] },
  { title: "ป้ายและงานพิมพ์", subtitle: "ป้าย 100 เรื่องราว Advertising และพื้นที่งานพิมพ์", src: "/assets/829496059_1758986729360819_9209155475496199215_n.jpg", images: ["/assets/829496059_1758986729360819_9209155475496199215_n.jpg"] },
  { title: "ป้ายสถานีชาร์จ EV", subtitle: "ป้ายไฟ EV Station Route 11 และ OneCharge", src: "/assets/สถานีชาร์จ EV เรืองแสงยามค่ำคืน.png", images: ["/assets/สถานีชาร์จ EV เรืองแสงยามค่ำคืน.png"] },
];
const steps = [
  { title: "ปรึกษา / แจ้งความต้องการ", detail: "พูดคุยรายละเอียดงาน\nรับคำแนะนำจากทีมงาน", icon: ChatBubbleIcon, color: "yellow" },
  { title: "ออกแบบและเสนอราคา", detail: "ออกแบบตามความต้องการ\nพร้อมเสนอราคา", icon: FileTextIcon, color: "pink" },
  { title: "ผลิตงาน", detail: "ผลิตด้วยวัสดุคุณภาพ\nได้มาตรฐาน", icon: GearIcon, color: "cyan" },
  { title: "ติดตั้งหน้างาน", detail: "ทีมงานติดตั้งอย่างมืออาชีพ\nดูแลครบจบงาน", icon: CheckCircledIcon, color: "yellow" },
];

function Arrow({ className = "" }: { className?: string }) { return <ChevronRightIcon className={className} width={20} height={20} aria-hidden="true" />; }

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const root = mainRef.current;
    if (!root || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const targets = root.querySelectorAll<HTMLElement>('.section-heading, .section-description, .service-card, .work-card, .process-step, .contact-inner');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('motion-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(target => {
      // Only animate content below the viewport, so initial content stays visible.
      if (target.getBoundingClientRect().top >= window.innerHeight) {
        target.classList.add('motion-pending');
        observer.observe(target);
      }
    });
    return () => {
      observer.disconnect();
      targets.forEach(target => target.classList.remove('motion-pending', 'motion-visible'));
    };
  }, []);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<{ title: string; detail: string } | null>(null);
  const [activeWork, setActiveWork] = useState<(typeof works)[number] | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryImages = activeWork?.images.map(src => ({ src, title: activeWork.title, description: activeWork.subtitle })) ?? [];
  const galleryImage = galleryImages[galleryIndex];
  const moveGallery = (direction: number) => setGalleryIndex(current => galleryImages.length > 1 ? (current + direction + galleryImages.length) % galleryImages.length : current);
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#home" aria-label="100 เรื่องราว Advertising หน้าหลัก" className="brand"><Image src="/logo.png" alt="100 เรื่องราว Advertising" width={2048} height={734} priority className="brand-image" /></a>
          <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="เมนูหลัก">
            {[["หน้าแรก", "home"], ["บริการ", "services"], ["ผลงาน", "work"], ["เกี่ยวกับเรา", "about"], ["ติดต่อเรา", "contact"]].map(([name, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{name}</a>)}
          </nav>
          <a className="button yellow header-cta" href="#contact">ขอใบเสนอราคา <Arrow /></a>
          <button className="menu-toggle" aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}</button>
        </div>
      </header>
      <main ref={mainRef}>
        <section id="home" className="hero">
          <div className="hero-photo"><Image src="/assets/cover.png" alt="หน้าร้าน 100 เรื่องราว Advertising" fill priority sizes="100vw" className="hero-cover" /></div>
          <div className="hero-shade" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">ป้ายโฆษณา ไวนิล สติ๊กเกอร์ ตู้ไฟ และงานพิมพ์ครบวงจร</p>
              <h1>เปลี่ยนทุกไอเดีย<br /><span>ให้เป็นงานโฆษณา</span><br />ที่โดดเด่น<i className="underline-swoosh" /></h1>
              <p className="hero-description">เราคือทีมงานที่พร้อมดูแลทุกงานโฆษณา<br />ตั้งแต่การออกแบบ ผลิต ติดตั้ง ด้วยคุณภาพ<br />และความใส่ใจในทุกรายละเอียด</p>
              <div className="hero-actions"><a href="#contact" className="button yellow"><ChatBubbleIcon /> ปรึกษางานกับเรา <Arrow /></a><a href="#work" className="button outline"><span className="play-icon"><PlayIcon width={13} height={13} aria-hidden="true" /></span> ดูผลงาน</a></div>
            </div>
          </div>
        </section>
        <section id="services" className="services-section">
          <div className="container">
            <div className="section-top"><div className="section-heading"><p>OUR SERVICES</p><h2>บริการของเรา</h2><span>งานโฆษณาครบวงจร ตอบโจทย์ทุกธุรกิจ</span></div><p className="section-description">เราพร้อมให้บริการงานป้ายและสื่อโฆษณาทุกรูปแบบ<br />ด้วยวัสดุคุณภาพสูง ทีมงานมืออาชีพ และงานติดตั้งที่ได้มาตรฐาน</p></div>
            <div id="service-cards" className="service-grid">{services.map(service => <button className="service-card" key={service.title} onClick={() => setSelected(service)}><div className="service-image-wrap"><Image src={service.src} alt={service.title} fill sizes="(max-width: 850px) 45vw, (max-width: 1283px) 23vw, 285px" className="service-photo" /></div><span className={`service-icon ${service.color}`}><service.icon width={27} height={27} aria-hidden="true" /></span><div className="service-body"><div className="card-title"><h3>{service.title}</h3><span className="circle-arrow"><Arrow /></span></div><p>{service.detail}</p></div></button>)}</div>
          </div>
        </section>
        <div className="dark-section">
          <section id="work" className="work-section container"><div className="section-top"><div className="section-heading"><p>OUR WORK</p><h2>ผลงานของเรา</h2><span>ตัวอย่างงานจริง จากหลากหลายธุรกิจ</span></div></div><div id="work-gallery" className="work-grid">{works.map(work => <button className="work-card" key={work.src} onClick={() => { setActiveWork(work); setGalleryIndex(0); }}><Image src={work.src} alt={work.subtitle} fill sizes="(max-width: 540px) 90vw, (max-width: 1283px) 30vw, 383px" className="work-photo" /><div className="work-caption"><span>{work.title}</span><span className="work-arrow"><Arrow /></span></div></button>)}</div></section>
          <section id="about" className="process-section container"><div className="section-heading"><p>OUR PROCESS</p><h2>ขั้นตอนการทำงาน</h2><span>ดูแลทุกขั้นตอน ตั้งแต่ต้นจนจบ</span></div><div className="process-grid">{steps.map((step, i) => <div className="process-step" key={step.title}><div className={`step-icon ${step.color}`}><step.icon width={25} height={25} /></div><strong className={`step-number text-${step.color}`}>0{i + 1}</strong><h3>{step.title}</h3><p>{step.detail}</p></div>)}</div></section>
          <section id="contact" className="contact-section"><div className="contact-ribbon cyan" /><div className="contact-ribbon pink" /><div className="container contact-inner"><div><h2>ให้เราเป็นส่วนหนึ่ง<br />ในการสร้างแบรนด์ของคุณ</h2><p>งานโฆษณาคุณภาพ ในราคาที่เหมาะสม<br />ติดต่อเราได้เลยวันนี้</p></div><a href="tel:0972828232" className="phone-pill"><span><MobileIcon width={27} height={27} /></span>097-2828232</a><a href="tel:0972828232" className="contact-pill"><span className="chat-dot"><ChatBubbleIcon width={22} height={22} /></span>ปรึกษาและขอราคา <Arrow /></a></div></section>
        </div>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><a href="#home" className="footer-brand"><Image src="/logo.png" alt="100 เรื่องราว Advertising" width={2048} height={734} className="brand-image" /></a><nav aria-label="เมนูท้ายเว็บไซต์"><a href="#home">หน้าแรก</a><a href="#services">บริการ</a><a href="#work">ผลงาน</a><a href="#about">เกี่ยวกับเรา</a><a href="#contact">ติดต่อเรา</a></nav><a href="tel:0972828232" className="footer-phone"><MobileIcon /> 097-2828232</a><a href="#home" className="back-top" aria-label="กลับขึ้นด้านบน"><ChevronUpIcon width={22} height={22} aria-hidden="true" /></a></div></footer>
      <nav className="floating-contact" aria-label="ช่องทางติดต่อด่วน">
        <a href="https://line.me/ti/p/~100storiess" target="_blank" rel="noopener noreferrer" className="floating-link floating-line" aria-label="แชท LINE 100storiess">
          <span className="floating-label">LINE: 100storiess</span>
          <Image src="/icons/line.svg" alt="" width={32} height={32} unoptimized />
        </a>
        <a href="https://www.facebook.com/100storiess" target="_blank" rel="noopener noreferrer" className="floating-link floating-facebook" aria-label="Facebook 100storiess">
          <span className="floating-label">Facebook</span>
          <Image src="/icons/facebook.svg" alt="" width={32} height={32} unoptimized />
        </a>
        <a href="tel:0972828232" className="floating-link floating-phone" aria-label="โทร 097-2828232">
          <span className="floating-label">097-2828232</span>
          <MobileIcon width={27} height={27} aria-hidden="true" />
        </a>
      </nav>
      <Dialog.Root open={activeWork !== null} onOpenChange={open => { if (!open) { setActiveWork(null); setGalleryIndex(0); } }}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="gallery-dialog" onKeyDown={event => {
            if (event.key === "ArrowRight") { event.preventDefault(); moveGallery(1); }
            if (event.key === "ArrowLeft") { event.preventDefault(); moveGallery(-1); }
          }}>
            <div className="gallery-header">
              <div><Dialog.Title>{galleryImage?.title}</Dialog.Title><Dialog.Description>{galleryImage?.description}</Dialog.Description></div>
              <Dialog.Close className="gallery-close" aria-label="ปิดแกลเลอรี"><Cross2Icon width={22} height={22} /></Dialog.Close>
            </div>
            <div className="gallery-stage">
              {galleryImage && <Image key={galleryImage.src} src={galleryImage.src} alt={galleryImage.description} fill sizes="(max-width: 700px) 94vw, 1000px" className="gallery-image" />}
              {galleryImages.length > 1 && <><button className="gallery-prev" aria-label="ภาพก่อนหน้า" onClick={() => moveGallery(-1)}><ChevronLeftIcon width={24} height={24} /></button>
              <button className="gallery-next" aria-label="ภาพถัดไป" onClick={() => moveGallery(1)}><ChevronRightIcon width={24} height={24} /></button></>}
              <span className="gallery-count" aria-live="polite">{(galleryIndex ?? 0) + 1} / {galleryImages.length}</span>
            </div>
            <div className="gallery-thumbnails" aria-label="เลือกภาพผลงาน">
              {galleryImages.map((image, index) => <button key={image.src} className={index === galleryIndex ? "gallery-thumbnail active" : "gallery-thumbnail"} aria-label={`ดูภาพที่ ${index + 1}: ${image.title}`} aria-pressed={index === galleryIndex} onClick={() => setGalleryIndex(index)}><Image src={image.src} alt="" fill sizes="80px" /></button>)}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content"><Dialog.Title>{selected?.title}</Dialog.Title><Dialog.Description>{selected?.detail}</Dialog.Description><p>บอกความต้องการ ขนาด และจำนวนที่ต้องการ ทีมงานพร้อมช่วยแนะนำวัสดุและประเมินราคาสำหรับงานของคุณ</p><a className="button yellow" href="tel:0972828232"><MobileIcon /> โทรปรึกษา 097-2828232</a><Dialog.Close className="dialog-close" aria-label="ปิดรายละเอียด"><Cross2Icon /></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>
    </>
  );
}
