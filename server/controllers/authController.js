// module จัดการไฟล์ Node
const fs = require("fs");
const path = require("path");
const prisma = require("../config/prisma");

// HASH
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { loginSchema, userSchema } = require("../validators/validators");
const { includes } = require("zod");
const SECRET_KEY = process.env.JWT_SECRET;

// sendemail
const sendEmail = require("../utils/sendEmail");

exports.login = async (req, res) => {
  const { email, password, role } = loginSchema.parse(req.body);

  const user = await prisma[role].findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
  }

  // ถ้าผ่าน create JWT
  const token = jwt.sign(
    { id: role === "doctor" ? user.doc_id : user.pa_id, role: role },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: { email: user.email, role },
  });
};

exports.register = async (req, res) => {
  const { role } = req.params;
  if (role !== "doctor" && role !== "patient") {
    return res.status(400).json({ error: "Invalid role" });
  }

  const validatedData = userSchema.parse(req.body);
  const existingUser = await prisma[role].findUnique({
    where: { email: validatedData.email },
  });

  if (existingUser) {
    return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานแล้ว" });
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(validatedData.password, saltRounds);

  const newUser = await prisma[role].create({
    data: {
      ...validatedData,
      password: hashedPassword,
    },
  });

  // sendemail
  try {
    await sendEmail({
      email: newUser.email,
      subject: `ยินดีต้อนรับสู่ Clinic Connect (${role})`,
      message: `สวัสดีคุณ ${newUser.firstname}, บัญชีของคุณถูกสร้างเรียบร้อยแล้ว`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4CAF50;">ลงทะเบียนสำเร็จ!</h2>
          <p>สวัสดีคุณ <strong>${newUser.firstname} ${newUser.lastname}</strong></p>
          <p>ขอบคุณที่สมัครสมาชิกกับ Clinic Connect ในฐานะ <strong>${role}</strong></p>
          <p>ขณะนี้คุณสามารถเข้าสู่ระบบเพื่อใช้งานได้ทันที</p>
          <br />
          <p style="font-size: 0.8em; color: #888;">นี่คืออีเมลอัตโนมัติ กรุณาอย่าตอบกลับ</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("[Email Error] ไม่สามารถส่งเมลได้:", error.message);
  }

  delete newUser.password;
  res.status(201).json({
    message: "ลงทะเบียนสำเร็จ",
    user: newUser,
  });
};

exports.getMe = async (req, res) => {
  const { id, role } = req.user;

  const user = await prisma[role.toLowerCase()].findUnique({
    where: {
      [role.toLowerCase() === "doctor" ? "doc_id" : "pa_id"]: id,
    },
    include: {
      appointments: {
        include: {
          patient: {
            select: {
              firstname: true,
              lastname: true,
              phone: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return res.status(404).json({ error: "ไม่พบข้อมูลผู้ใช้งาน" });
  }

  delete user.password;
  const userWithRole = { ...user, role }
  res.json(userWithRole);
};

exports.updateProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "กรุณาเลือกไฟล์รูปภาพ" });
  }

  const { id, role } = req.user;
  const fileName = req.file.filename;

  // หา data เก่า
  const user = await prisma[role.toLowerCase()].findUnique({
    where: {
      [role.toLowerCase() === "doctor" ? "doc_id" : "pa_id"]: id,
    },
  });

  // 2. ลบรูปเก่า (ถ้ามี)
  if (user && user.profile_img) {
    // ใช้ process.cwd() เพื่อเริ่มจาก Root ของ Project เลย
    const oldPath = path.join(process.cwd(), "uploads", user.profile_img);

    console.log("กำลังจะลบไฟล์ที่:", oldPath); // เพิ่มบรรทัดนี้เพื่อเช็คใน Terminal ว่า Path ถูกไหม

    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
      console.log("ลบไฟล์เก่าสำเร็จ!");
    } else {
      console.log("หาไฟล์เก่าไม่เจอในเครื่อง");
    }
  }

  const updatedUser = await prisma[role.toLowerCase()].update({
    where: {
      [role.toLowerCase() === "doctor" ? "doc_id" : "pa_id"]: id,
    },
    data: {
      profile_img: fileName,
    },
  });
  res.json({
    message: "อัปโหลดรูปโปรไฟล์สำเร็จ",
    imageUrl: `/uploads/${fileName}`, // ส่ง Path กลับไปให้ Frontend ใช้แสดงผล
  });
};
