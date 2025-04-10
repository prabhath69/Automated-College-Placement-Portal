const companyDriveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  branchesAllowed: {
    type: [String],
    required: true,
  },
  minCGPA: {
    type: String,
    required: true,
  },
  lastDateToApply: {
    type: Date,
    required: true,
  },
  rounds: {
    type: [String],
    required: true,
  },

  eligibility: {
    String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("CompanyDrive", companyDriveSchema);
