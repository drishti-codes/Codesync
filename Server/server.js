require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const http = require("http")
const setupSocket = require("./src/socket/index")

const app = express()
const server = http.createServer(app)

app.use(cors())
app.use(express.json())

// MongoDB Connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err))

const authRoutes = require("./src/routes/auth")
app.use("/api/auth", authRoutes)

const roomRoutes = require("./src/routes/rooms")
app.use("/api/rooms", roomRoutes)

// Test route
app.get("/", (req, res) => {
  res.json({ message: "CodeSync API is running!" })
})

// ✅ Socket.io setup
setupSocket(server)

const PORT = process.env.PORT || 5000

// ✅ server.listen (app.listen nahi)
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})