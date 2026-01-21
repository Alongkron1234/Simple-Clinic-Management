const { z } = require("zod");

const errorHandler = (err, req, res, next) => {
  console.error("LOG: ", err.stack);

  // zod validation
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: "ข้อมูลไม่ถูกต้อง (Validation Error)",
      details: err.flatten().fieldErrors,
    });
  }

  //   Prisma Error
  if (err.code?.startsWith("P")) {
    return res.status(400).json({
      error: "Database Error",
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler