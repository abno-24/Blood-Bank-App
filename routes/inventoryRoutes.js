const express = require("express");
const authMiddelware = require("../middlewares/authMiddelware");
const { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganisationController } = require("../controllers/inventoryController");

const router = express.Router();

//routes
//ADD INVENTORY || POST
router.post('/create-inventory', authMiddelware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get("/get-inventory", authMiddelware, getInventoryController);

//GET DONAR RECORDS
router.get("/get-donars", authMiddelware, getDonarsController);

//GET HOSPITAL RECORDS
router.get("/get-hospitals", authMiddelware, getHospitalController);

//GET ORGANISATION RECORDS
router.get("/get-organisation", authMiddelware, getOrganisationController);

module.exports = router;