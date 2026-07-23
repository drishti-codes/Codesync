const mongoose = require("mongoose")

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["collaboration", "interview"],
      default: "collaboration",
    },
    language: {
      type: String,
      default: "JavaScript",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    allowExecution: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    code: {
      type: String,
      default: "",
    },
    // ✅ Collaboration rooms ke joiners yahan track honge (creator ke alawa)
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // Interview-specific fields
    problemId: {
      type: Number,
      default: null,
    },
    interviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Room", roomSchema)