const prisma = require("../config/prisma");
const { appointmentSchema } = require("../validators/validators");

exports.createAppointment = async (req, res) => {
  const validatedData = appointmentSchema.parse(req.body);
  validatedData.appointmentDate = new Date(validatedData.appointmentDate);

  // 3. (Optional) เพิ่ม Logic พิเศษ เช่น ห้ามจองเวลาที่ผ่านมาแล้ว
  if (validatedData.appointmentDate < new Date()) {
    return res.status(400).json({ error: "ไม่สามารถจองเวลาย้อนหลังได้" });
  }

  const patient = await prisma.patient.findUnique({
    where: { pa_id: validatedData.pa_id },
  });

  if (!patient) {
    return res.status(404).json({ error: "ไม่พบข้อมูลคนไข้รายนี้" });
  }

  // 4. บันทึก
  const newAppointment = await prisma.appointment.create({
    data: validatedData,
  });

  res.status(201).json(newAppointment);
};

exports.getAll = async (req, res) => {
  if (req.user.role != "doctor" && req.user.role != "admin") {
    return res.status(403).json({
      error: "Forbidden",
      message: "เฉพาะหมอหรือแอดมินเท่านั้นที่ดูรายชื่อนัดหมายทั้งหมดได้",
    });
  }

  const data = await prisma.appointment.findMany({
    include: {
      doctor: true,
      patient: true,
    },
  });
  console.log("Data fetched:", data);
  res.json(data);
};

exports.getById = async (req, res) => {
  const { id } = req.params;
  const data = await prisma.appointment.findUnique({
    where: {
      apoint_id: parseInt(id),
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (!data) {
    return res.status(404).json({ error: "ไม่พบการนัดหมายนี้" });
  }
  res.json(data);
};

exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  const deleteData = await prisma.appointment.delete({
    where: {
      apoint_id: parseInt(id),
    },
  });
  res.json({ message: "Deleted successfully", data: deleteData });
};

exports.updateAppointment = async (req, res) => {
  const { id } = req.params;

//   const currentAppoint = await prisma.appointment.findUnique({
//     where: {
//       apoint_id: parseInt(id),
//     },
//   });

//   if (!currentAppoint) return res.status(404).json({ error: "ไม่พบนัดหมาย" });

//   const isDoctorOwner = req.user.role === "doctor" && req.user.id === currentAppoint.doc_id;
//   const isPatientOwner = req.user.role === "patient" && req.user.id === currentAppoint.pa_id;

//   if (req.user.role !== "admin" && !isDoctorOwner && !isPatientOwner) {
//     return res.status(403).json({ error: "คุณไม่มีสิทธิ์แก้ไขนัดหมายนี้" });
//   }

  const validatedData = appointmentSchema.partial().parse(req.body);

  if (validatedData.pa_id) {
    const patient = await prisma.patient.findUnique({
      where: { pa_id: validatedData.pa_id },
    });

    if (!patient) {
      return res.status(404).json({ error: "ไม่พบข้อมูลคนไข้รายนี้" });
    }
  }

  if (validatedData.doc_id) {
    const doctor = await prisma.doctor.findUnique({
      where: { doc_id: validatedData.doc_id },
    });
    if (!doctor) {
      return res.status(404).json({ error: "ไม่พบข้อมูลหมอ" });
    }
  }

  if (validatedData.appointmentDate) {
    validatedData.appointmentDate = new Date(validatedData.appointmentDate);
  }

  const updatedAppointment = await prisma.appointment.update({
    where: {
      apoint_id: parseInt(id),
    },
    data: validatedData,
  });

  res.json({
    message: "อัปเดตนัดหมายสำเร็จ",
    data: updatedAppointment,
  });
};
