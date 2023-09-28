const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const { getDonarsListController, getHospitalsListController, getOrgListController, deleteDonarController, deleteHospitalController } = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || DONAR LIST
router.get("/donar-list", authMiddelware, adminMiddleware, getDonarsListController);

//GET || HOSPITAL LIST
router.get("/hospital-list", authMiddelware, adminMiddleware, getHospitalsListController);

//GET || HOSPITAL LIST
router.get("/organisation-list", authMiddelware, adminMiddleware, getOrgListController);

//GET || DELETE DONAR
router.delete("/delete-donar/:id", authMiddelware, adminMiddleware, deleteDonarController);

//GET || DELETE HOSPITAL
router.delete("/delete-hospital/:id", authMiddelware, adminMiddleware, deleteDonarController);

//GET || DELETE ORGANISATION
router.delete("/delete-organisation/:id", authMiddelware, adminMiddleware, deleteDonarController);

//EXPORT
module.exports = router;