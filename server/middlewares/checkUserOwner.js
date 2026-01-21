const checkUserOwner = async (req, res, next) => {
  const { id } = req.params;
  const { tableName } = req.params;
  const userId = req.user.id;
  const userRole = req.user.role;

  if (userRole === "admin") return next();

  const isOwner = userRole === tableName && userId === parseInt(id);

  if (!isOwner) {
    return res.status(403).json({
      error: "Forbidden",
      message: "คุณไม่มีสิทธิ์จัดการข้อมูลของผู้อื่น",
    });
  }

  next();
};

module.exports = checkUserOwner;
