import { z } from "zod";
export const adminUserSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-]{1,80}$/).optional(),
  name: z.string().trim().min(1, "กรุณากรอกชื่อ").max(120),
  email: z.string().trim().email("อีเมลไม่ถูกต้อง").max(254).transform(value => value.toLowerCase()),
  role: z.enum(["admin", "editor"]), enabled: z.boolean(),
  password: z.string().max(256).optional().refine(value => !value || value.length >= 12, "รหัสผ่านต้องอย่างน้อย 12 ตัว"),
});
