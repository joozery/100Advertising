"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, EnvelopeClosedIcon, LockClosedIcon, EyeOpenIcon, EyeNoneIcon, ImageIcon, DashboardIcon, GearIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
export default function LoginForm({ configured }: {
    configured: boolean;
}) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setBusy(true);
        setError("");
        const data = new FormData(event.currentTarget);
        try {
            const response = await fetch("/api/admin/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }) });
            const result = await response.json();
            if (!response.ok)
                throw new Error(result.error || "เข้าสู่ระบบไม่สำเร็จ");
            router.replace("/admin");
            router.refresh();
        }
        catch (e) {
            setError(e instanceof Error ? e.message : "เชื่อมต่อไม่สำเร็จ");
        }
        finally {
            setBusy(false);
        }
    }
    return <main className="cms-login">
      <section className="cms-login-brand" aria-label="100 Advertising CMS">
        <Link href="/" className="cms-login-logo"><Image src="/logo.png" width={245} height={88} alt="100Advertising" priority /></Link>
        <div className="cms-brand-content">
          <span className="cms-brand-eyebrow"><i /> 100 ADVERTISING CMS</span>
          <h2>ทุกเรื่องราวของแบรนด์<br /><span>เริ่มต้นที่นี่.</span></h2>
          <p>พื้นที่จัดการเว็บไซต์ของคุณ<br />อัปเดตผลงาน บริการ และทุกเรื่องราวได้ในที่เดียว</p>
          <div className="cms-brand-features">
            <div><ImageIcon /><span>ผลงานและแกลเลอรี</span></div>
            <div><DashboardIcon /><span>บริการของคุณ</span></div>
            <div><GearIcon /><span>เนื้อหาเว็บไซต์</span></div>
          </div>
        </div>
        <div className="cms-brand-footer"><span>100 เรื่องราว Advertising</span><span>CONTENT MANAGEMENT SYSTEM</span></div>
        <div className="cms-brand-orbit" aria-hidden="true" />
      </section>
      <section className="cms-login-panel">
        <Link href="/" className="cms-login-back"><ArrowLeftIcon /> กลับหน้าเว็บไซต์</Link>
        <div className="cms-login-form-wrap">
          <div className="cms-login-lock"><LockClosedIcon /></div>
          <span className="cms-login-eyebrow">WELCOME BACK</span>
          <h1>เข้าสู่ระบบแอดมิน</h1>
          <p className="cms-login-description">ยินดีต้อนรับกลับมา เข้าสู่ระบบเพื่อจัดการเว็บไซต์</p>
          {!configured && <div className="admin-notice">ระบบเข้าสู่ระบบยังไม่พร้อมใช้งาน กรุณาติดต่อผู้ดูแลระบบ</div>}
          <form onSubmit={submit} aria-busy={busy}>
            <fieldset disabled={busy || !configured}>
              <label htmlFor="login-email">อีเมล</label>
              <div className="cms-login-input"><EnvelopeClosedIcon /><input id="login-email" name="email" type="email" autoComplete="username" required maxLength={254} placeholder="your@email.com" /></div>
              <label htmlFor="login-password">รหัสผ่าน</label>
              <div className="cms-login-input"><LockClosedIcon /><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required maxLength={256} placeholder="กรอกรหัสผ่านของคุณ" /><button type="button" className="cms-password-toggle" aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeNoneIcon /> : <EyeOpenIcon />}</button></div>
            </fieldset>
            {error && <p className="admin-error" role="alert">{error}</p>}
            <button className="cms-login-submit" disabled={busy || !configured}>{busy ? <><span className="cms-login-spinner" /> กำลังเข้าสู่ระบบ…</> : <>เข้าสู่ระบบ <ArrowRightIcon /></>}</button>
          </form>
          <p className="cms-login-help">สำหรับผู้ดูแลเว็บไซต์และสมาชิกที่ได้รับสิทธิ์</p>
        </div>
        <footer className="cms-login-credit">CMS by <strong>Wooyou Creative</strong><span>สร้างสรรค์ทุกไอเดียให้เป็นจริง</span></footer>
      </section>
    </main>;
}
