const express = require("express")
const Room = require("../models/Room")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

// ===== CREATE ROOM =====
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, type, language, isPublic, allowExecution } = req.body

    if (!name) {
      return res.status(400).json({ message: "Room name is required" })
    }

    const room = await Room.create({
      name,
      type: type || "collaboration",
      language: language || "JavaScript",
      isPublic: isPublic !== undefined ? isPublic : true,
      allowExecution: allowExecution !== undefined ? allowExecution : true,
      createdBy: req.userId,
      interviewerId: type === "interview" ? req.userId : null,
    })

    res.status(201).json({ room })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// ===== GET ALL ROOMS (rooms user created OR joined) =====
router.get("/", authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({
      $or: [
        { createdBy: req.userId },
        { participants: req.userId },
        { interviewerId: req.userId },
        { candidateId: req.userId },
      ],
    }).sort({ updatedAt: -1 })

    res.json({ rooms })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// ===== GET SINGLE ROOM =====
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    res.json({ room })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// ===== UPDATE ROOM CODE (collaboration save) =====
router.patch("/:id/code", authMiddleware, async (req, res) => {
  try {
    const { code } = req.body

    const room = await Room.findByIdAndUpdate(
      req.params.id,
      { code },
      { new: true }
    )

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    res.json({ room })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// ===== JOIN ROOM (collaboration participant OR interview candidate) =====
router.patch("/:id/join", authMiddleware, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    if (room.type === "interview") {
      if (!room.candidateId) {
        room.candidateId = req.userId
        await room.save()
      }
    } else {
      // ✅ Collaboration room — creator ke alawa joining wale ko participants mein add karo
      const isCreator = room.createdBy.toString() === req.userId
      const alreadyParticipant = room.participants.some(
        (p) => p.toString() === req.userId
      )

      if (!isCreator && !alreadyParticipant) {
        room.participants.push(req.userId)
        await room.save()
      }
    }

    res.json({ room })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router