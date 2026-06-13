const { Server } = require("socket.io")

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // production mein frontend URL daalna
      methods: ["GET", "POST"],
    },
  })

  // Room ke andar connected users track karne ke liye
  const roomUsers = {}

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id)

    // ===== JOIN ROOM =====
    socket.on("join-room", ({ roomId, user }) => {
      socket.join(roomId)
      socket.data.roomId = roomId
      socket.data.user = user

      if (!roomUsers[roomId]) roomUsers[roomId] = {}
      roomUsers[roomId][socket.id] = user

      // Sabko updated user list bhejo
      io.to(roomId).emit("room-users", Object.values(roomUsers[roomId]))

      // Dusro ko batao naya user aaya
      socket.to(roomId).emit("user-joined", user)

      console.log(`👤 ${user?.name} joined room ${roomId}`)
    })

    // ===== CODE CHANGE (collaborative editing) =====
    socket.on("code-change", ({ roomId, code }) => {
      socket.to(roomId).emit("code-update", code)
    })

    // ===== CURSOR POSITION =====
    socket.on("cursor-change", ({ roomId, userId, userName, color, position }) => {
      socket.to(roomId).emit("cursor-update", { userId, userName, color, position })
    })

    // ===== CHAT MESSAGE =====
    socket.on("send-message", ({ roomId, message }) => {
      io.to(roomId).emit("new-message", message)
    })

    // ===== LANGUAGE CHANGE =====
    socket.on("language-change", ({ roomId, language }) => {
      socket.to(roomId).emit("language-update", language)
    })

    // ===== INTERVIEW: TIMER =====
    socket.on("timer-update", ({ roomId, timeLeft, isRunning }) => {
      socket.to(roomId).emit("timer-sync", { timeLeft, isRunning })
    })

    // ===== INTERVIEW: PROBLEM CHANGE =====
    socket.on("problem-change", ({ roomId, problem }) => {
      socket.to(roomId).emit("problem-update", problem)
    })

    // ===== INTERVIEW: HINT REVEAL =====
    socket.on("hint-reveal", ({ roomId, hintsRevealed }) => {
      socket.to(roomId).emit("hint-update", hintsRevealed)
    })

    // ===== DISCONNECT =====
    socket.on("disconnect", () => {
      const { roomId, user } = socket.data

      if (roomId && roomUsers[roomId]) {
        delete roomUsers[roomId][socket.id]
        io.to(roomId).emit("room-users", Object.values(roomUsers[roomId]))
        socket.to(roomId).emit("user-left", user)
      }

      console.log("❌ User disconnected:", socket.id)
    })
  })

  return io
}

module.exports = setupSocket