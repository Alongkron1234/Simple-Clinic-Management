const express = require("express")
const app = express()
const cors = require('cors')
require("dotenv").config()

// Middleware
const authenticateToken = require("./middlewares/authMiddleware")
const errorHandler = require("./middlewares/errorMiddleware")

// Routes
const authRoutes = require("./routes/authRoutes")
const dataRoutes = require("./routes/dataRoutes")
const appointmentRoutes = require("./routes/appointmentRoutes")

app.use(cors())
app.use(express.json())


app.use("/public", dataRoutes)
app.use("/auth", authRoutes)

app.use("/uploads", express.static("uploads"))

app.use(authenticateToken)

app.use("/api/appointment", appointmentRoutes)
app.use("/api", dataRoutes)


app.use(errorHandler)

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});