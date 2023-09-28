const userModel = require("../models/userModel");

//GET DONAR LIST
const getDonarsListController = async (req, res) => {
    try {
        const donarData = await userModel
        .find({ role: "donar" })
        .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: donarData.length,
            message: "Donar List Fetched Successfully",
            donarData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in donar list API",
            error,
        });
    }
};

//GET HOSPITAL LIST
const getHospitalsListController = async (req, res) => {
    try {
        const hospitalData = await userModel
        .find({ role: "hospital" })
        .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: hospitalData.length,
            message: "Hospital List Fetched Successfully",
            hospitalData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Hospital list API",
            error,
        });
    }
};

//GET ORGANISATION LIST
const getOrgListController = async (req, res) => {
    try {
        const orgData = await userModel
        .find({ role: "organisation" })
        .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            TotalCount: orgData.length,
            message: "Organisation List Fetched Successfully",
            orgData,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in Organisation list API",
            error,
        });
    }
};

//DELETE DONAR FUNCTIONALITY
const deleteDonarController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: "Record Deleted Successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting",
            error,
        });
    }
};

//EXPORT
module.exports = { getDonarsListController, getHospitalsListController, getOrgListController, deleteDonarController, };