"use client";

import Image from "next/image";
import { Pencil2Icon, TrashIcon, MagnifyingGlassIcon, EyeOpenIcon, EyeNoneIcon, DashboardIcon } from "@radix-ui/react-icons";
import type { Service } from "@/lib/types";

type Status = "all" | "published" | "hidden";
type Props = {
  items: Service[];
  search: string;
  setSearch: (value: string) => void;
  status: Status;
  setStatus: (value: Status) => void;
  disabled: boolean;
  toggle: (item: Service) => void;
  open: (item: Service) => void;
  remove: (item: Service) => void;
};

const iconLabels = { sign: "งานป้าย", print: "งานพิมพ์", sticker: "สติ๊กเกอร์", design: "ออกแบบ" };
export default function ServiceList({ items, search, setSearch, status, setStatus, disabled, toggle, open, remove }: Props) {
  return <section className="admin-list service-library">
    <div className="content-library-heading"><div><h2>รายการบริการ <span>{items.length}</span></h2><p>ดูภาพประกอบและรายละเอียดของแต่ละบริการได้ในที่เดียว</p></div></div>
    <div className="admin-list-toolbar content-toolbar">
      <div className="content-filters" role="group" aria-label="กรองสถานะ">
        {([['all', 'ทั้งหมด'], ['published', 'เผยแพร่'], ['hidden', 'ซ่อน']] as const).map(([value, label]) => <button key={value} className={status === value ? "active" : ""} aria-pressed={status === value} onClick={() => setStatus(value)}>{label}</button>)}
      </div>
      <div className="content-search"><MagnifyingGlassIcon /><input aria-label="ค้นหาบริการ" placeholder="ค้นหาชื่อบริการ…" value={search} onChange={e => setSearch(e.target.value)} /></div>
    </div>
    {!items.length && <div className="content-empty"><DashboardIcon /><h3>ไม่พบบริการ</h3><p>เพิ่มบริการใหม่ หรือลองเปลี่ยนคำค้นหาและตัวกรอง</p></div>}
    <div className="service-admin-grid">{items.map(item => <article className="service-admin-card" key={item.id}>
      <button className={`service-admin-photo ${item.color}`} onClick={() => open(item)} disabled={disabled} aria-label={`แก้ไข ${item.title}`}><Image src={item.src} alt={item.title} fill sizes="(max-width: 700px) 90vw, (max-width: 1200px) 40vw, 25vw" unoptimized /><span className="service-admin-sequence">{String(item.order + 1).padStart(2, '0')}</span></button>
      <div className="service-admin-body"><div className="service-admin-meta"><span>{iconLabels[item.icon]}</span><span className={item.published ? "admin-badge published" : "admin-badge"}>{item.published ? "เผยแพร่" : "ซ่อน"}</span></div><h3>{item.title}</h3><p>{item.detail}</p></div>
      <div className="service-admin-actions"><button className="admin-btn service-edit" onClick={() => open(item)} disabled={disabled}><Pencil2Icon /> แก้ไขบริการ</button><button className="admin-icon-btn" title={item.published ? "ซ่อน" : "เผยแพร่"} aria-label={`${item.published ? "ซ่อน" : "เผยแพร่"} ${item.title}`} onClick={() => toggle(item)} disabled={disabled}>{item.published ? <EyeOpenIcon /> : <EyeNoneIcon />}</button><button className="admin-icon-btn danger" title="ลบ" aria-label={`ลบ ${item.title}`} onClick={() => remove(item)} disabled={disabled}><TrashIcon /></button></div>
    </article>)}</div>
    <div className="content-list-footer">แสดง {items.length} บริการ <span>เรียงตามลำดับบนเว็บไซต์</span></div>
  </section>;
}
