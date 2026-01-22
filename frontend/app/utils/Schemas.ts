import { z } from "zod"; 

export const registerSchema = z.object({
  firstname: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  lastname: z.string().min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
  phone: z.string().min(10, "เบอร์โทรศัพท์ต้องมีอย่างน้อย 10 หลัก").optional().or(z.literal("")),
}); 