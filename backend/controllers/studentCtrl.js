const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const studentcontroller = {
  register: asyncHandler(async (req, res) => {
    const { fullname, email, password, jntuno, branch, cgpa, resume } =
      req.body;
    if (
      !fullname ||
      !email ||
      !password ||
      !jntuno ||
      !branch ||
      !cgpa ||
      !resume
    ) {
      throw new Error("Please all fields are required");
    }
    const StudentExists = await Student.findOne({ jntuno });
    if (StudentExists) {
      throw new Error("Student already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const StudentCreated = await Student.create({
      email,
      fullname,
      password: hashedPassword,
      jntuno,
      branch,
      cgpa,
      resume,
    });
    res.json({
      fullname: StudentCreated.fullname,
      email: StudentCreated.email,
      jntuno: StudentCreated.jntuno,
      branch: StudentCreated.branch,
      cgpa: StudentCreated.cgpa,
      resume: StudentCreated.resume,
      id: StudentCreated._id,
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { jntuno, password } = req.body;
    const student = await Student.findOne({ jntuno });
    if (!student) {
      throw new Error("Invalid login credentials");
    }
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      throw new Error("Invalid login credentials");
    }
    const token = jwt.sign({ id: student._id }, "prabath", {
      expiresIn: "5d",
    });
    res.json({
      message: "Login Success",
      token,
      id: student._id,
      email: student.email,
      fullname: student.fullname,
    });
  }),
  profile: asyncHandler(async (req, res) => {
    const student = await Student.findById(req.user);
    if (!student) {
      throw new Error("Student not found");
    }
    res.json({
      fullname: student.fullname,
      email: student.email,
      jntuno: student.jntuno,
      branch: student.branch,
      cgpa: student.cgpa,
      resume: student.resume,
    });
  }),

  changeStudentPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const student = await Student.findById(req.user);
    if (!student) {
      throw new Error("Student not found");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    student.password = hashedPassword;
    await student.save({
      validateBeforeSave: false,
    });
    //!Send the response
    res.json({ message: "Password Changed successfully" });
  }),

  updateStudentProfile: asyncHandler(async (req, res) => {
    const { fullname, email, jntuno, branch, cgpa, resume } = req.body;
    const updatedStudent = await Student.findByIdAndUpdate(
      req.user,
      {
        fullname,
        email,
        jntuno,
        branch,
        cgpa,
        resume,
      },
      { new: true }
    );
    res.json({
      message: "Student profile updated successfully",
      updatedStudent,
    });
  }),
};

module.exports = studentcontroller;
