const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const tryCatch = require("../utils/tryCatch");
const checkAppointmentOwner = require("../middlewares/checkAppointmentOwner");

router.get("/", tryCatch(appointmentController.getAll))
router.get("/:id", checkAppointmentOwner, tryCatch(appointmentController.getById))
router.post("/createAppointment", tryCatch(appointmentController.createAppointment))
router.delete("/:id", checkAppointmentOwner, tryCatch(appointmentController.deleteAppointment))
router.put("/:id", checkAppointmentOwner, tryCatch(appointmentController.updateAppointment))

module.exports = router