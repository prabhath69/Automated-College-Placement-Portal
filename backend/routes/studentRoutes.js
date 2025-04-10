const express = require("express");
const studentCtrl = require("../controllers/studentCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const studentRouter = express.Router();
//!Register
studentRouter.post("/placement-portal/student/register", studentCtrl.register);
//! Login
studentRouter.post("/placement-portal/student/login", studentCtrl.login);
//!Profile
studentRouter.get(
  "/placement-portal/student/profile",
  isAuthenticated,
  studentCtrl.profile
);
//!change password
studentRouter.put(
  "/placement-portal/student/change-password",
  isAuthenticated,
  studentCtrl.changeStudentPassword,
);
//!update profile
studentRouter.put(
  "/placement-portal/student/update-profile",
  isAuthenticated,
  studentCtrl.updateStudentProfile,

);

module.exports = studentRouter;