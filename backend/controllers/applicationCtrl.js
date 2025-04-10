const asyncHandler = require("express-async-handler");
const Application = require("../models/Application");
const CompanyDrive = require("../models/CompanyDrive");

// Student applies for a drive
const applyForDrive = asyncHandler(async (req, res) => {
  const studentId = req.user; // student user id from auth
  const { driveId } = req.body;

  // Check if already applied
  const alreadyApplied = await Application.findOne({ studentId, driveId });
  if (alreadyApplied) {
    throw new Error("Already applied to this drive");
  }

  // Create new application
  const application = await Application.create({
    studentId,
    driveId,
    status: "applied",
  });

  res.json({ message: "Applied successfully", application });
});

// View all drives student applied for
const getStudentApplications = asyncHandler(async (req, res) => {
  const studentId = req.user;

  const applications = await Application.find({ studentId })
    .populate("driveId")
    .sort({ createdAt: -1 });

  res.json(applications);
});

// View application status for a specific drive
const getApplicationStatus = asyncHandler(async (req, res) => {
  const studentId = req.user;
  const { driveId } = req.params;

  const application = await Application.findOne({ studentId, driveId });
  if (!application) {
    throw new Error("No application found for this drive");
  }

  res.json({ status: application.status });
});

module.exports = {
  applyForDrive,
  getStudentApplications,
  getApplicationStatus,
};
