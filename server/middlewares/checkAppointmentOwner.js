const prisma = require("../config/prisma");

const checkAppointmentOwner = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  const appointment = await prisma.appointment.findUnique({
    where: {
      apoint_id: parseInt(id),
    },
  });

  if (!appointment)
    return res.status(404).json({ error: "ไม่พบนัดหมายที่ระบุ" });

  const isDocOwner = userRole === "doctor" && userId === appointment.doc_id;
  const isPatOwner = userRole === "patient" && userId === appointment.pa_id;

  // 3. ถ้าไม่ใช่ Admin และไม่ใช่เจ้าของทั้งสองฝั่ง ให้บล็อก
  if (userRole !== "admin" && !isDocOwner && !isPatOwner) {
    return res
      .status(403)
      .json({ error: "คุณไม่มีสิทธิ์จัดการข้อมูลนัดหมายนี้" });
  }
  next();
};

module.exports = checkAppointmentOwner
