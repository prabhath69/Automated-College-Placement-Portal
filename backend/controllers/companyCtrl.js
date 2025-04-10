const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Company = require("../models/Company");
const CompanyDrive = require("../models/CompanyDrive");
const Application = require("../models/Application");
const Student = require("../models/Student");

const companyController = {
  // Company Registration
  register: asyncHandler(async (req, res) => {
    const { companyname, hrname, companyemail, password } = req.body;
    if (!companyname || !hrname || !companyemail || !password) {
      throw new Error("All fields are required");
    }

    const existing = await Company.findOne({ companyemail });
    if (existing) {
      throw new Error("Company already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = await Company.create({
      companyname,
      hrname,
      companyemail,
      password: hashedPassword,
    });

    res.json({
      message: "Company registered successfully",
      id: newCompany._id,
      companyname: newCompany.companyname,
      hrname: newCompany.hrname,
      companyemail: newCompany.companyemail,
    });
  }),

  // Company Login
  login: asyncHandler(async (req, res) => {
    const { companyemail, password } = req.body;
    const company = await Company.findOne({ companyemail });
    if (!company) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: company._id }, "prabath", { expiresIn: "5d" });

    res.json({
      message: "Login successful",
      token,
      id: company._id,
      companyname: company.companyname,
      companyemail: company.companyemail,
    });
  }),

  // Create Company Drive
  createDrive: asyncHandler(async (req, res) => {
    const {
      driveName,
      eligiblebranch,
      minCgpa,
      deadline,
      description,
    } = req.body;

    const drive = await CompanyDrive.create({
      driveName,
      companyId: req.user, // Authenticated company
      eligiblebranch,
      minCgpa,
      deadline,
      description,
    });

    res.json({ message: "Drive created successfully", drive });
  }),

  // View Company Drives
  getCompanyDrives: asyncHandler(async (req, res) => {
    const drives = await CompanyDrive.find({ companyId: req.user });
    res.json(drives);
  }),

  // Add Shortlist/Selection
  updateApplicationStatus: asyncHandler(async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;

    const updated = await Application.findByIdAndUpdate(applicationId, { status }, { new: true });
    if (!updated) throw new Error("Application not found");

    res.json({ message: "Application status updated", updated });
  }),

  // View Eligible Students
  getEligibleStudents: asyncHandler(async (req, res) => {
    const { driveId } = req.params;
    const drive = await CompanyDrive.findById(driveId);
    if (!drive) throw new Error("Drive not found");

    const eligibleStudents = await Student.find({
      branch: { $in: drive.eligiblebranch },
      cgpa: { $gte: drive.minCgpa },
    });

    res.json({ eligibleStudents });
  }),
};

module.exports = companyController;
