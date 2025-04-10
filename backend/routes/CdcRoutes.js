const express = require("express");
const cdcCtrl = require("../controllers/cdcCtrl");
const isAuthenticated = require("../middlewares/isAuth");
const cdcRouter = express.Router();

cdcRouter.post("/placement-portal/CDC/register", cdcCtrl.register);

cdcRouter.post("/placement-portal/CDC/login", cdcCtrl.login);

cdcRouter.put(
  "/placement-portal/CDC/change-password",
  isAuthenticated,
  cdcCtrl.changeCdcPassword
);

cdcRouter.post(
  "/placement-portal/CDC/add-company",
  isAuthenticated,
  cdcCtrl.addCompany
);

cdcRouter.put(
  "/placement-portal/CDC/update-company/:companyId",
  isAuthenticated,
  cdcCtrl.updateCompany
);

cdcRouter.delete(
  "/placement-portal/CDC/delete-company/:companyId",
  isAuthenticated,
  cdcCtrl.deleteCompany
);

// Get all companies
cdcRouter.get(
  "/placement-portal/CDC/companies",
  isAuthenticated,
  cdcCtrl.getAllCompanies
);

module.exports = cdcRouter;
