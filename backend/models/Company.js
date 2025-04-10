const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
