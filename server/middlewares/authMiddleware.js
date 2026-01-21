const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      error: "Unauthorized", 
      message: "กรุณาเข้าสู่ระบบก่อนใช้งาน" 
    });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        error: "Forbidden", 
        message: "Token ของคุณไม่ถูกต้อง หรือหมดอายุแล้ว" 
      });
    }

    req.user = user;
    
    next();
  });
};

module.exports = authenticateToken;