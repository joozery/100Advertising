"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, ImageIcon, CheckCircledIcon, EyeNoneIcon, ExternalLinkIcon } from "@radix-ui/react-icons";
import type { Content, ContentKind, Service, Work } from "@/lib/types";
import type { Draft } from "./types";
import ContentList from "./content-list";
import ServiceList from "./service-list";
import ContentEditor from "./content-editor";
const draftOf = (item?: Work | Service): Draft => ({ id: item?.id ?? crypto.randomUUID(), title: item?.title ?? "", src: item?.src ?? "", order: item?.order ?? 0, published: item?.published ?? true, subtitle: item && "subtitle" in item ? item.subtitle : "", images: item && "images" in item ? [...item.images] : [], detail: item && "detail" in item ? item.detail : "", icon: item && "icon" in item ? item.icon : "sign", color: item && "color" in item ? item.color : "yellow" });
async function api(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok)
        throw new Error(result.error || "ดำเนินการไม่สำเร็จ");
    return result;
}
export default function ContentManager({ initial, uploadReady, kind }: {
    initial: Content;
    uploadReady: boolean;
    kind: ContentKind;
}) {
    const router = useRouter();
    const [content, setContent] = useState(initial);
    const [draft, setDraft] = useState<Draft | null>(null);
    const [busy, setBusy] = useState(false), [uploading, setUploading] = useState(false);
    const [notice, setNotice] = useState(""), [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"all" | "published" | "hidden">("all");
    const items = content[kind].filter(item => item.title.toLowerCase().includes(search.toLowerCase()) && (status === "all" || item.published === (status === "published")));
    async function refresh() { setContent(await api("/api/admin/content")); router.refresh(); }
    function open(item?: Work | Service) { setError(""); setNotice(""); setDraft(item ? draftOf(item) : { ...draftOf(), order: Math.max(-1, ...content[kind].map(row => row.order)) + 1 }); }
    async function save(event: FormEvent) {
        event.preventDefault();
        if (!draft)
            return;
        if (!draft.src || (kind === "works" && !draft.images.length)) {
            setError("กรุณาอัปโหลดภาพปกและรูปแกลเลอรีก่อนบันทึก");
            return;
        }
        setBusy(true);
        setError("");
        setNotice("");
        const payload = kind === "works" ? { id: draft.id, title: draft.title, subtitle: draft.subtitle, src: draft.src, images: draft.images, order: draft.order, published: draft.published } : { id: draft.id, title: draft.title, detail: draft.detail, src: draft.src, icon: draft.icon, color: draft.color, order: draft.order, published: draft.published };
        try {
            await api(`/api/admin/content?kind=${kind}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
            await refresh();
            setDraft(null);
            setNotice("บันทึกเรียบร้อย หน้าเว็บไซต์อัปเดตแล้ว");
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "บันทึกไม่สำเร็จ");
        }
        finally {
            setBusy(false);
        }
    }
    async function remove(item: Work | Service) {
        if (!window.confirm(`ลบ “${item.title}” ออกจากเว็บไซต์?`))
            return;
        setBusy(true);
        setError("");
        try {
            await api(`/api/admin/content?kind=${kind}&id=${encodeURIComponent(item.id)}`, { method: "DELETE" });
            await refresh();
            if (draft?.id === item.id)
                setDraft(null);
            setNotice("ลบรายการเรียบร้อย");
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "ลบไม่สำเร็จ");
        }
        finally {
            setBusy(false);
        }
    }
    async function toggle(item: Work | Service) {
        setBusy(true);
        setError("");
        try {
            await api(`/api/admin/content?kind=${kind}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...item, published: !item.published }) });
            await refresh();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "อัปเดตไม่สำเร็จ");
        }
        finally {
            setBusy(false);
        }
    }
    async function upload(files: FileList | null, gallery: boolean) {
        if (!files || !draft)
            return;
        setUploading(true);
        setError("");
        setNotice("");
        try {
            for (const file of Array.from(files)) {
                if (file.size > 4 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))
                    throw new Error("รองรับ JPG, PNG, WebP ขนาดไม่เกิน 4 MB ต่อรูป");
                const form = new FormData();
                form.append("file", file);
                const { url } = await api("/api/admin/upload", { method: "POST", body: form });
                setDraft(current => current ? { ...current, src: gallery ? current.src || url : url, images: gallery ? [...current.images, url] : kind === "works" && !current.images.length ? [url] : current.images } : null);
            }
            setNotice("อัปโหลดรูปเรียบร้อย กดบันทึกเพื่อแสดงบนเว็บไซต์");
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "อัปโหลดไม่สำเร็จ");
        }
        finally {
            setUploading(false);
        }
    }
    function reorderImage(index: number, direction: number) {
        if (!draft)
            return;
        const next = [...draft.images], target = index + direction;
        if (target < 0 || target >= next.length)
            return;
        [next[index], next[target]] = [next[target], next[index]];
        setDraft({ ...draft, images: next });
    }
    return <div className="content-workspace"><div className="content-breadcrumb">จัดการเนื้อหา <span>/</span> <strong>{kind === "works" ? "ผลงาน" : "บริการ"}</strong></div><header className="admin-top"><div><span className="admin-kicker">{kind === "works" ? "PORTFOLIO MANAGEMENT" : "SERVICE MANAGEMENT"}</span><h1>{kind === "works" ? "ผลงานและแกลเลอรี" : "บริการของเรา"}</h1><p>{kind === "works" ? "จัดการผลงานและรูปภาพแยกของแต่ละชิ้น" : "จัดการภาพ ชื่อ และรายละเอียดบริการ"}</p></div><div className="content-header-actions"><a className="admin-btn content-preview" href={kind === "works" ? "/#work" : "/#services"} target="_blank" rel="noreferrer"><ExternalLinkIcon /> ดูหน้าเว็บไซต์</a><button className="admin-btn primary" disabled={busy || uploading} onClick={() => open()}><PlusIcon /> เพิ่ม{kind === "works" ? "ผลงาน" : "บริการ"}</button></div></header>
      {!uploadReady && <div className="admin-notice">Cloudflare R2 ยังไม่เชื่อมต่อ ตั้งค่า R2 ใน .env.local เพื่ออัปโหลดรูปภาพ</div>}
      {error && !draft && <div className="admin-error" role="alert">{error}</div>}{notice && !draft && <div className="admin-success" role="status">{notice}</div>}
      <div className="admin-stats content-stats">
        <div><span className="content-stat-icon"><ImageIcon /></span><div><span>รายการทั้งหมด</span><strong>{content[kind].length}<small>รายการ</small></strong></div></div>
        <div><span className="content-stat-icon live"><CheckCircledIcon /></span><div><span>เผยแพร่บนเว็บไซต์</span><strong>{content[kind].filter(item => item.published).length}<small>รายการ</small></strong></div></div>
        <div><span className="content-stat-icon hidden"><EyeNoneIcon /></span><div><span>ฉบับร่าง / ซ่อน</span><strong>{content[kind].filter(item => !item.published).length}<small>รายการ</small></strong></div></div>
      </div>
      <div className="admin-content">{kind === "services" ? <ServiceList items={items as Service[]} status={status} setStatus={setStatus} search={search} setSearch={setSearch} disabled={busy || uploading} toggle={toggle} open={open} remove={remove} /> : <ContentList items={items} status={status} setStatus={setStatus} selectedId={draft?.id} search={search} setSearch={setSearch} busy={busy} uploading={uploading} toggle={toggle} open={open} remove={remove}/>}
        {draft && <ContentEditor error={error} notice={notice} draft={draft} setDraft={setDraft} kind={kind} existing={content[kind].some(item => item.id === draft.id)} busy={busy} uploading={uploading} uploadReady={uploadReady} save={save} upload={upload} reorderImage={reorderImage} setError={setError}/>}
      </div>
  </div>;
}
