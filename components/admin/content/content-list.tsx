"use client";

import Image from "next/image";
import { Pencil2Icon, TrashIcon, MagnifyingGlassIcon, ImageIcon, EyeOpenIcon, EyeNoneIcon } from "@radix-ui/react-icons";
import type { Work, Service } from "@/lib/types";

type Status = "all" | "published" | "hidden";
type Props = {
  items: (Work | Service)[];
  search: string;
  setSearch: (value: string) => void;
  status: Status;
  setStatus: (value: Status) => void;
  selectedId?: string;
  busy: boolean;
  uploading: boolean;
  toggle: (item: Work | Service) => void;
  open: (item: Work | Service) => void;
  remove: (item: Work | Service) => void;
};

export default function ContentList({ items, search, setSearch, status, setStatus, selectedId, busy, uploading, toggle, open, remove }: Props) {
  const disabled = busy || uploading;
  return <section className="admin-list content-library">
    <div className="content-library-heading"><div><h2>รายการทั้งหมด <span>{items.length}</span></h2><p>จัดการภาพปก แกลเลอรี และสถานะการเผยแพร่</p></div></div>
    <div className="admin-list-toolbar content-toolbar">
      <div className="content-filters" role="group" aria-label="กรองสถานะ">
        {([['all', 'ทั้งหมด'], ['published', 'เผยแพร่'], ['hidden', 'ซ่อน']] as const).map(([value, label]) => <button key={value} className={status === value ? "active" : ""} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}
      </div>
      <div className="content-search"><MagnifyingGlassIcon /><input aria-label="ค้นหารายการ" placeholder="ค้นหาชื่อรายการ…" value={search} onChange={e => setSearch(e.target.value)} /></div>
    </div>
    <div className="content-table-heading"><span>ผลงาน / รายการ</span><span>สถานะ</span><span>ลำดับ</span><span>จัดการ</span></div>
    {!items.length && <div className="content-empty"><ImageIcon /><h3>{search || status !== "all" ? "ไม่พบรายการที่ตรงกับการค้นหา" : "เริ่มเพิ่มผลงานของคุณ"}</h3><p>{search || status !== "all" ? "ลองเปลี่ยนคำค้นหาหรือเลือกสถานะทั้งหมด" : "กดเพิ่มรายการเพื่ออัปโหลดภาพและสร้างแกลเลอรี"}</p></div>}
    {items.map(item => <article key={item.id} className={`content-table-row ${selectedId === item.id ? "is-selected" : ""}`}>
      <button className="content-item" onClick={() => open(item)} disabled={disabled} aria-label={`แก้ไข ${item.title}`}>
        <div className="admin-row-photo"><Image src={item.src} alt="" fill sizes="80px" unoptimized /></div>
        <div className="admin-row-info"><h2>{item.title}</h2><p>{"images" in item ? <><ImageIcon /> {item.images.length} รูปในแกลเลอรี</> : item.detail}</p></div>
      </button>
      <span className={item.published ? "admin-badge published" : "admin-badge"}><i />{item.published ? "เผยแพร่" : "ซ่อน"}</span>
      <span className="content-order">{String(item.order + 1).padStart(2, "0")}</span>
      <div className="admin-row-actions">
        <button className="admin-icon-btn" title={item.published ? "ซ่อนจากเว็บไซต์" : "เผยแพร่บนเว็บไซต์"} aria-label={`${item.published ? "ซ่อน" : "เผยแพร่"} ${item.title}`} disabled={disabled} onClick={() => toggle(item)}>{item.published ? <EyeOpenIcon /> : <EyeNoneIcon />}</button>
        <button className="admin-icon-btn content-edit-button" title="แก้ไข" aria-label={`เปิดฟอร์มแก้ไข ${item.title}`} onClick={() => open(item)} disabled={disabled}><Pencil2Icon /></button>
        <button className="admin-icon-btn danger" title="ลบ" aria-label={`ลบ ${item.title}`} onClick={() => remove(item)} disabled={disabled}><TrashIcon /></button>
      </div>
    </article>)}
    <div className="content-list-footer">แสดง {items.length} รายการ <span>เรียงตามลำดับบนเว็บไซต์</span></div>
  </section>;
}
