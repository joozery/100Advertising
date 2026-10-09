"use client";
import Image from "next/image";
import { UploadIcon, ChevronUpIcon, ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import type { Dispatch, SetStateAction } from "react";
import type { Draft } from "./types";
export default function GalleryEditor({ draft, setDraft, uploadReady, uploading, upload, reorderImage, setError }: {
    draft: Draft;
    setDraft: Dispatch<SetStateAction<Draft | null>>;
    uploadReady: boolean;
    uploading: boolean;
    upload: (files: FileList | null, gallery: boolean) => Promise<void>;
    reorderImage: (index: number, direction: number) => void;
    setError: (error: string) => void;
}) { return (<div className="admin-gallery-editor"><h3>รูปแกลเลอรี ({draft.images.length}/30)</h3><p>อัปโหลดรูปแล้วเลือกภาพปก และจัดลำดับได้ รูปจะแสดงเฉพาะผลงานชิ้นนี้</p><button type="button" className="admin-btn subtle" disabled={!draft.src || draft.images.includes(draft.src) || draft.images.length >= 30} onClick={() => setDraft({ ...draft, images: [...draft.images, draft.src] })}>เพิ่มภาพปกเข้าแกลเลอรี</button>{draft.images.map((src, index) => <div className="admin-gallery-row" key={`${index}-${src}`}><div className="admin-gallery-photo"><Image src={src} alt={`ภาพ ${index + 1}`} fill sizes="60px" unoptimized/></div><span className="admin-gallery-image-label">ภาพที่ {index + 1}</span><button type="button" className="admin-btn subtle" disabled={draft.src === src} onClick={() => setDraft({ ...draft, src })}>{draft.src === src ? "ภาพปก" : "ใช้เป็นปก"}</button><button type="button" className="admin-icon-btn" disabled={index === 0} aria-label="เลื่อนภาพขึ้น" onClick={() => reorderImage(index, -1)}><ChevronUpIcon /></button><button type="button" className="admin-icon-btn" disabled={index === draft.images.length - 1} aria-label="เลื่อนภาพลง" onClick={() => reorderImage(index, 1)}><ChevronDownIcon /></button><button type="button" className="admin-icon-btn danger" aria-label="นำภาพออกจากแกลเลอรี" onClick={() => setDraft({ ...draft, images: draft.images.filter((_, i) => i !== index) })}><Cross2Icon /></button></div>)}<div className="admin-gallery-add"><label className={uploadReady ? "admin-upload" : "admin-upload disabled"}><UploadIcon /> อัปโหลดหลายภาพ<input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={!uploadReady || uploading || draft.images.length >= 30} onChange={e => { if ((e.target.files?.length ?? 0) + draft.images.length > 30) {
    setError("สูงสุด 30 รูปต่อผลงาน");
    e.target.value = "";
    return;
} void upload(e.target.files, true); e.target.value = ""; }}/></label></div></div>); }
