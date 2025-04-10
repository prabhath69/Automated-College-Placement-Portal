const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyname: {
      type: String,
      required: true,
    },
    companyemail: {
      type: String,
      required: true,
      unique: true,
    },
    hrname: {
      type: String,
      required: true,
    },
    jobdescription: {
      type: String,
      required: true,
    },
    postedDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CompanyDrive",
        required: true,
      },
    ],
    eligiblebranch: {
      type: [String],
      required: true,
    },
    minCgpa: {
      type: String,
      default:"None",
    },
    deadline: {
      type: Date,
      required: true,
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
