const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Cdc = require("../models/Cdc");
const Company = require("../models/Company");

const cdccontroller = {
  // Register CDC
  register: asyncHandler(async (req, res) => {
    const { fullname, email, password } = req.body;
    if (!fullname || !email || !password) {
      throw new Error("Please fill in all fields");
    }

    const CdcExists = await Cdc.findOne({ email });
    if (CdcExists) {
      throw new Error("CDC already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const CdcCreated = await Cdc.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.json({
      fullname: CdcCreated.fullname,
      email: CdcCreated.email,
      id: CdcCreated._id,
    });
  }),

  // Login CDC
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const cdc = await Cdc.findOne({ email });
    if (!cdc) {
      throw new Error("Invalid login credentials");
    }

    const isMatch = await bcrypt.compare(password, cdc.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }

    const token = jwt.sign({ id: cdc._id }, "prabath", {
      expiresIn: "5d",
    });

    res.json({
      message: "Login successful",
      token,
      id: cdc._id,
      email: cdc.email,
      fullname: cdc.fullname,
    });
  }),

  // Change CDC password
  changeCdcPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const cdc = await Cdc.findById(req.user);
    if (!cdc) {
      throw new Error("CDC not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    cdc.password = hashedPassword;
    await cdc.save({ validateBeforeSave: false });

    res.json({ message: "Password changed successfully" });
  }),

  // Add a new company
  addCompany: asyncHandler(async (req, res) => {
    const {
      companyname,
      hrname,
      companyemail,
      eligiblebranch,
      minCgpa,
      deadline,
      jobdescription,
    } = req.body;

    console.log("Received Company Data:", req.body);

    if (
      !companyname ||
      !hrname ||
      !companyemail ||
      !eligiblebranch ||
      !deadline ||
      !jobdescription
    ) {
      throw new Error("Please fill in all required fields");
    }

    // Check if companyemail already exists
    const companyExists = await Company.findOne({ companyemail });
    if (companyExists) {
      throw new Error("A company with this email already exists");
    }

    const newCompany = await Company.create({
      companyname,
      hrname,
      companyemail,
      eligiblebranch,
      minCgpa: minCgpa || "None",
      deadline,
      jobdescription,
    });

    res.json({ message: "Company added successfully", company: newCompany });
  }),

  // Delete a company
  deleteCompany: asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const deleted = await Company.findByIdAndDelete(companyId);
    if (!deleted) {
      throw new Error("Company not found");
    }

    res.json({ message: "Company deleted successfully" });
  }),

  // Update a company
  updateCompany: asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const {
      companyname,
      hrname,
      companyemail,
      eligiblebranch,
      minCgpa,
      deadline,
      jobdescription,
    } = req.body;

    if (!companyemail) {
      throw new Error("Company email is required for updating");
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      {
        companyname,
        hrname,
        companyemail,
        eligiblebranch,
        minCgpa,
        deadline,
        jobdescription,
      },
      { new: true }
    );

    if (!updatedCompany) {
      throw new Error("Company not found");
    }

    res.json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  }),

  // Get all companies
  getAllCompanies: asyncHandler(async (req, res) => {
    const companies = await Company.find();
    res.json(companies);
  }),
};

module.exports = cdccontroller;
