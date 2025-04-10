const mongoose = require("mongoose");

const interviewSlotSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyDrive",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  interviewDate: {
    type: Date,
    required: true,
  },
  interviewTime: {
    type: String,
    required: true, // e.g., "10:00 AM"
  },
  interviewer: {
    type: String, // optional field
    default: "To be assigned",
  },
  feedback: {
    type: String,
    default: "",
  },
  comments: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["Scheduled", "Shortlisted", "Selected", "Rejected"],
    default: "Scheduled",
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("InterviewSlot", interviewSlotSchema);
