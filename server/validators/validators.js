const { z, email } = require("zod");

const userSchema = z.object({
  firstname: z.string().min(2, "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร"),
  lastname: z.string().min(2, "นามสกุลต้องมีอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(6, "รหัสผ่านต้องยาวอย่างน้อย 6 ตัว"),
  phone: z.string().regex(/^[0-9]{10}$/, "เบอร์โทรต้องเป็นตัวเลข 10 หลัก").optional(),
});

const appointmentSchema = z.object({
  doc_id: z.number().int(),
  pa_id: z.number().int(),
  appointmentDate: z.string().datetime(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]).default("pending"),
});

// JWT
const loginSchema = z.object({
  email: z.string().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "รหัสผ่านต้องยาวอย่างน้อย 6 ตัว"),
  role: z.enum(["doctor", "patient"])
})

// ส่งออกไปให้ไฟล์อื่นใช้
module.exports = { userSchema, appointmentSchema, loginSchema };