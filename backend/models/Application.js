const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CompanyDrive",
    required: true,
  },
  status: {
    type: String,
    enum: ["applied", "withdrawn", "selected", "rejected"],
    default: "applied",
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Application", applicationSchema);
