const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  // 1. ดึง Token จาก Header "Authorization"
  const authHeader = req.headers["authorization"];
  
  // รูปแบบคือ "Bearer TOKEN_STRING" เราเลยต้องแยกเอาแค่ส่วนที่ 2
  const token = authHeader && authHeader.split(" ")[1];

  // 2. ถ้าไม่มี Token ส่งมาเลย
  if (!token) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "กรุณาเข้าสู่ระบบก่อนใช้งาน" 
    });
  }

  // 3. ตรวจสอบความถูกต้องของ Token
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "Token ของคุณไม่ถูกต้อง หรือหมดอายุแล้ว" 
      });
    }

    // 4. ถ้าผ่าน! เก็บข้อมูลที่อยู่ใน Token (id, role) ไว้ในตัวแปร req.user
    // เพื่อให้ Route ถัดไป (next) เอาไปใช้เช็คต่อได้
    req.user = user;
    
    // 5. ปล่อยให้ไปทำงานที่ Route ต่อไป
    next();
  });
};

module.exports = authenticateToken;