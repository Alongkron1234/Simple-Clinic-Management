const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const tryCatch = require("../utils/tryCatch");
const authenticateToken = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware")

router.post("/login", tryCatch(authController.login))
router.post("/register/:role", tryCatch(authController.register))
router.get("/me", authenticateToken, tryCatch(authController.getMe))
router.patch("/profile-image", authenticateToken, upload.single("image"), tryCatch(authController.updateProfileImage))

module.exports = router