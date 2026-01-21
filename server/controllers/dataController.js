const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const { userSchema } = require("../validators/validators");
const { search } = require("../routes/authRoutes");

exports.getAll = async (req, res) => {
  const tableName = req.params.tableName.toLowerCase();
  if (!prisma[tableName]) {
    return res
      .status(404)
      .json({ error: `Table '${tableName}' not found in database` });
  }

  const data = await prisma[tableName].findMany();
  res.json(data);
};

exports.getById = async (req, res) => {
  const { tableName, id } = req.params;
  const idMap = {
    doctor: "doc_id",
    patient: "pa_id",
    appointment: "apoint_id",
  };
  const targetIdField = idMap[tableName.toLowerCase()];

  const data = await prisma[tableName.toLowerCase()].findUnique({
    where: { [targetIdField]: parseInt(id) },
  });
  if (!data) return res.status(404).json({ message: "Data not found" });
  res.json(data);
};

exports.deleteData = async (req, res) => {
  const { tableName, id } = req.params;
  const userIdFrommToken = req.user.id;
  const userRoleFromToken = req.user.role;

  // if (userRoleFromToken !== "admin" && userIdFrommToken !== parseInt(id)) {
  //   return res.status(403).json({
  //     error: "Forbidden",
  //     message: "คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้อื่น",
  //   });
  // }

  if (userRoleFromToken !== "admin") {
    const isOwner = userIdFrommToken === parseInt(id);
    const isRightTable = userRoleFromToken === tableName.toLowerCase();

    if (!isOwner || !isRightTable) {
      return res.status(403).json({
        error: "Forbidden",
        message: "คุณไม่มีสิทธิ์จัดการข้อมูลนี้",
      });
    }
  }
  const idMap = {
    doctor: "doc_id",
    patient: "pa_id",
    appointment: "apoint_id",
  };
  const targetIdField = idMap[tableName.toLowerCase()];

  const deleteData = await prisma[tableName.toLowerCase()].delete({
    where: { [targetIdField]: parseInt(id) },
  });
  res.json({ message: "Deleted successfully", data: deleteData });
};

exports.updateData = async (req, res) => {
  const { tableName, id } = req.params;
  const userIdFrommToken = req.user.id;
  const userRoleFromToken = req.user.role;

  if (userRoleFromToken !== "admin" && userIdFrommToken !== parseInt(id)) {
    return res.status(403).json({
      error: "Forbidden",
      message: "คุณไม่มีสิทธิ์แก้ไขข้อมูลของผู้อื่น",
    });
  }

  const idMap = {
    doctor: "doc_id",
    patient: "pa_id",
  };

  const targetIdField = idMap[tableName.toLowerCase()];

  if (!targetIdField) {
    return res.status(404).json({ errors: "ไม่พบตารางที่ต้องการอัปเดต" });
  }

  const validatedData = userSchema.partial().parse(req.body); // partial ไม่ต้องส่งครบทุก field

  if (validatedData.password) {
    const saltRounds = 10;
    validatedData.password = await bcrypt.hash(
      validatedData.password,
      saltRounds
    );
  }

  const updateItem = await prisma[tableName.toLowerCase()].update({
    where: {
      [targetIdField]: parseInt(id),
    },
    data: validatedData,
  });

  if (updateItem.password) delete updateItem.password;

  res.json({
    message: "อัปเดตข้อมูลสำเร็จ",
    data: updateItem,
  });
};
