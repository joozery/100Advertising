"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "radix-ui";
import type { SiteSettings } from "@/lib/site-settings";
import type { Service, Work } from "@/lib/types";

const serviceIcons = { sign: DesktopIcon, print: ImageIcon, sticker: LayersIcon, design: Pencil2Icon };
import { DesktopIcon, ImageIcon, LayersIcon, Pencil2Icon, ChevronUpIcon, ChevronLeftIcon, PlayIcon, ChevronRightIcon, Cross2Icon, HamburgerMenuIcon, ChatBubbleIcon, FileTextIcon, GearIcon, CheckCircledIcon, MobileIcon } from "@radix-ui/react-icons";

const processIcons = { chat: ChatBubbleIcon, document: FileTextIcon, gear: GearIcon, check: CheckCircledIcon };

function ServiceIcon({ name }: { name: Service["icon"] }) { const Icon = serviceIcons[name]; return <Icon width={27} height={27} aria-hidden="true" />; }

function Arrow({ className = "" }: { className?: string }) { return <ChevronRightIcon className={className} width={20} height={20} aria-hidden="true" />; }

export default function LandingPage({ services, works, site }: { services: Service[]; works: Work[]; site: SiteSettings }) {
  const steps = site.steps.map(step => ({ ...step, icon: processIcons[step.icon] }));
  const navItems = site.navLabels.map((name, index) => [name, ["home", "services", "work", "about", "contact"][index]]);
  const phoneHref = `tel:${site.phone.replace(/[^+\d]/g, "")}`;
  const lineHref = `https://line.me/ti/p/~${encodeURIComponent(site.lineId)}`;
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
  const [activeSection, setActiveSection] = useState("home");
  const clickedSection = useRef<string | null>(null);
  useEffect(() => {
    let frame = 0;
    const updateSection = () => {
      frame = 0;
      if (clickedSection.current) return;
      const sections = mainRef.current?.querySelectorAll<HTMLElement>('section[id]');
      if (!sections) return;
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 82;
      const marker = headerHeight + (window.innerHeight - headerHeight) * .45;
      let current = "home";
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= marker) current = section.id;
      });

      setActiveSection(current);
    };
    const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(updateSection); };
    const resumeScrollTracking = () => { clickedSection.current = null; scheduleUpdate(); };
    const handleScrollKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) resumeScrollTracking();
    };
    scheduleUpdate();
    window.addEventListener('wheel', resumeScrollTracking, { passive: true });
    window.addEventListener('touchmove', resumeScrollTracking, { passive: true });
    window.addEventListener('keydown', handleScrollKey);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('wheel', resumeScrollTracking);
      window.removeEventListener('touchmove', resumeScrollTracking);
      window.removeEventListener('keydown', handleScrollKey);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
    };
  }, []);
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
          <a href="#home" aria-label="100 เรื่องราว Advertising หน้าหลัก" className="brand"><Image src={site.logo} unoptimized alt="100 เรื่องราว Advertising" width={2048} height={734} priority className="brand-image" /></a>
          <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="เมนูหลัก">
            {navItems.map(([name, id]) => <a key={id} href={`#${id}`} className={activeSection === id ? "active" : undefined} aria-current={activeSection === id ? "location" : undefined} onClick={() => { clickedSection.current = id; setActiveSection(id); setMenuOpen(false); }}>{name}</a>)}
          </nav>
          <a className="button yellow header-cta" href="#contact">{site.quoteLabel} <Arrow /></a>
          <button className="menu-toggle" aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}</button>
        </div>
      </header>
      <main ref={mainRef}>
        <section id="home" className="hero">
          <div className="hero-photo"><Image src={site.heroImage} unoptimized alt="หน้าร้าน 100 เรื่องราว Advertising" fill priority sizes="100vw" className="hero-cover" /></div>
          <div className="hero-shade" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">{site.heroEyebrow}</p>
              <div className="hero-title-row">
              <h1>{site.heroHeadline[0]}<br /><span>{site.heroHeadline[1]}</span><br />{site.heroHeadline[2]}<i className="underline-swoosh" /></h1>
              <a href={lineHref} target="_blank" rel="noopener noreferrer" className="hero-qr" aria-label="สแกน QR code หรือเปิดแชท LINE">
                <Image src={site.qrImage} unoptimized alt="QR code สำหรับติดต่อ 100 เรื่องราว Advertising" width={104} height={104} className="hero-qr-image" />
                <span><strong>{site.qrTitle}</strong><small>{site.qrDescription}</small></span>
              </a>
              </div>
              <p className="hero-description">{site.heroDescription.split("\n").map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}</p>
              <div className="hero-actions"><a href="#contact" className="button yellow"><ChatBubbleIcon /> {site.heroPrimaryLabel} <Arrow /></a><a href="#work" className="button outline"><span className="play-icon"><PlayIcon width={13} height={13} aria-hidden="true" /></span> {site.heroSecondaryLabel}</a></div>

            </div>
          </div>
        </section>
        <section id="services" className="services-section">
          <div className="container">
            <div className="section-top"><div className="section-heading"><p>{site.servicesEyebrow}</p><h2>{site.servicesTitle}</h2><span>{site.servicesSubtitle}</span></div><p className="section-description">{site.servicesDescription.split("\n").map((line, i) => <span key={i}>{i > 0 && <br />}{line}</span>)}</p></div>
            <div id="service-cards" className="service-grid">{services.map(service => <button className="service-card" key={service.title} onClick={() => setSelected(service)}><div className="service-image-wrap"><Image src={service.src} alt={service.title} fill sizes="(max-width: 850px) 45vw, (max-width: 1283px) 23vw, 285px" className="service-photo" unoptimized /></div><span className={`service-icon ${service.color}`}><ServiceIcon name={service.icon} /></span><div className="service-body"><div className="card-title"><h3>{service.title}</h3><span className="circle-arrow"><Arrow /></span></div><p>{service.detail}</p></div></button>)}</div>
          </div>
        </section>
        <div className="dark-section">
          <section id="work" className="work-section container"><div className="section-top"><div className="section-heading"><p>{site.worksEyebrow}</p><h2>{site.worksTitle}</h2><span>{site.worksSubtitle}</span></div></div><div id="work-gallery" className="work-grid">{works.map(work => <button className="work-card" key={work.src} onClick={() => { setActiveWork(work); setGalleryIndex(0); }}><Image src={work.src} alt={work.subtitle} fill sizes="(max-width: 540px) 90vw, (max-width: 1283px) 30vw, 383px" className="work-photo" unoptimized /><div className="work-caption"><span>{work.title}</span><span className="work-arrow"><Arrow /></span></div></button>)}</div></section>
          <section id="about" className="process-section container"><div className="section-heading"><p>{site.processEyebrow}</p><h2>{site.processTitle}</h2><span>{site.processSubtitle}</span></div><div className="process-grid">{steps.map((step, i) => <div className="process-step" key={step.title}><div className={`step-icon ${step.color}`}><step.icon width={25} height={25} /></div><strong className={`step-number text-${step.color}`}>0{i + 1}</strong><h3>{step.title}</h3><p>{step.detail}</p></div>)}</div></section>
          <section id="contact" className="contact-section"><div className="contact-ribbon cyan" /><div className="contact-ribbon pink" /><div className="container contact-inner"><div><h2>{site.contactHeadline.split("\n").map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}</h2><p>{site.contactDescription.split("\n").map((line, index) => <span key={index}>{index > 0 && <br />}{line}</span>)}</p></div><a href={phoneHref} className="phone-pill"><span><MobileIcon width={27} height={27} /></span>{site.phone}</a><a href={phoneHref} className="contact-pill"><span className="chat-dot"><ChatBubbleIcon width={22} height={22} /></span>{site.contactButtonLabel} <Arrow /></a></div></section>
        </div>
      </main>
      <footer className="site-footer"><div className="container footer-inner"><a href="#home" className="footer-brand"><Image src={site.logo} unoptimized alt="100 เรื่องราว Advertising" width={2048} height={734} className="brand-image" /></a><nav aria-label="เมนูท้ายเว็บไซต์">{navItems.map(([name, id]) => <a key={id} href={`#${id}`}>{name}</a>)}</nav><a href={phoneHref} className="footer-phone"><MobileIcon /> {site.phone}</a><a href="#home" className="back-top" aria-label="กลับขึ้นด้านบน"><ChevronUpIcon width={22} height={22} aria-hidden="true" /></a></div></footer>
      <nav className="floating-contact" aria-label="ช่องทางติดต่อด่วน">
        <a href={lineHref} target="_blank" rel="noopener noreferrer" className="floating-link floating-line" aria-label={`แชท LINE ${site.lineId}`}>
          <span className="floating-label">LINE: {site.lineId}</span>
          <Image src="/icons/line.svg" alt="" width={32} height={32} unoptimized />
        </a>
        <a href={site.facebookUrl} target="_blank" rel="noopener noreferrer" className="floating-link floating-facebook" aria-label={`Facebook ${site.lineId}`}>
          <span className="floating-label">Facebook</span>
          <Image src="/icons/facebook.svg" alt="" width={32} height={32} unoptimized />
        </a>
        <a href={phoneHref} className="floating-link floating-phone" aria-label={`โทร ${site.phone}`}>
          <span className="floating-label">{site.phone}</span>
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
              {galleryImage && <Image key={galleryImage.src} src={galleryImage.src} alt={galleryImage.description} fill sizes="(max-width: 700px) 94vw, 1000px" className="gallery-image" unoptimized />}
              {galleryImages.length > 1 && <><button className="gallery-prev" aria-label="ภาพก่อนหน้า" onClick={() => moveGallery(-1)}><ChevronLeftIcon width={24} height={24} /></button>
              <button className="gallery-next" aria-label="ภาพถัดไป" onClick={() => moveGallery(1)}><ChevronRightIcon width={24} height={24} /></button></>}
              <span className="gallery-count" aria-live="polite">{(galleryIndex ?? 0) + 1} / {galleryImages.length}</span>
            </div>
            <div className="gallery-thumbnails" aria-label="เลือกภาพผลงาน">
              {galleryImages.map((image, index) => <button key={image.src} className={index === galleryIndex ? "gallery-thumbnail active" : "gallery-thumbnail"} aria-label={`ดูภาพที่ ${index + 1}: ${image.title}`} aria-pressed={index === galleryIndex} onClick={() => setGalleryIndex(index)}><Image src={image.src} alt="" fill sizes="80px" unoptimized /></button>)}
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog-content"><Dialog.Title>{selected?.title}</Dialog.Title><Dialog.Description>{selected?.detail}</Dialog.Description><p>บอกความต้องการ ขนาด และจำนวนที่ต้องการ ทีมงานพร้อมช่วยแนะนำวัสดุและประเมินราคาสำหรับงานของคุณ</p><a className="button yellow" href={phoneHref}><MobileIcon /> โทรปรึกษา {site.phone}</a><Dialog.Close className="dialog-close" aria-label="ปิดรายละเอียด"><Cross2Icon /></Dialog.Close></Dialog.Content></Dialog.Portal></Dialog.Root>
    </>
  );
}
