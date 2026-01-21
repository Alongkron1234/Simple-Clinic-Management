const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
    // สร้างชื่อไฟล์ใหม่: profile-ID-TIMESTAMP.jpg เพื่อกันชื่อซ้ำ
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  }
})



const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // จำกัดขนาด 2MB
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimetype = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("รองรับเฉพาะไฟล์รูปภาพ (jpg, jpeg, png) เท่านั้น!"));
  }
});

module.exports = upload;