const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

//CREATE INVENTORY
const createInventoryController = async(req, res) => {
    try {
        const {email} = req.body;
        //validation
        const user = await userModel.findOne({email})
        if(!user){
            throw new Error('User Not Found!');
        }
        // if(inventoryType === "in" && user.role !== "donar"){
        //     throw new Error('Not a donar account')
        // }
        // if(inventoryType === "out" && user.role !== "hospital"){
        //     throw new Error('Not a donar account')
        // }

        if(req.body.inventoryType == "out"){
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organisation = new mongoose.Types.ObjectId(req.body.userId)

            //calculate blood quantity
            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {$match:{
                    organisation,
                    inventoryType: "in",
                    bloodGroup: requestedBloodGroup
                }},
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;

            //calculate out blood quantity
            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match:{
                        organisation,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group:{
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & out Calc
            const availableQuantityOfBloodGroup = totalIn - totalOut
            //quantity validation
            if(availableQuantityOfBloodGroup < requestedQuantityOfBlood){
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuantityOfBloodGroup} ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        }else{
            req.body.donar = user?._id;
        }

        //Save record
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success:true,
            message:'New Blood Record Added'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error in Create Inventory',
            error
        })
    }
};

//GET ALL BLOOD RECORDS
const getInventoryController = async(req, res) => {
    try {
        const inventory = await inventoryModel
            .find({
                organisation:req.body.userId
            })
            .populate("donar")
            .populate("hospital")
            .sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            message:"Get all records successfully",
            inventory
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in get All Inventory",
            error
        })
    }
}
//GET HOSPITAL BLOOD RECORDS
const getInventoryHospitalController = async(req, res) => {
    try {
        const inventory = await inventoryModel
            .find(req.body.filters)
            .populate("donar")
            .populate("hospital")
            .populate("organisation")
            .sort({createdAt:-1});
        return res.status(200).send({
            success:true,
            message:"Get hospital consumer records successfully",
            inventory,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error in get consumer Inventory",
            error,
        });
    }
};

//GET DONAR RECORD
const getDonarsController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //find donar
        const donorId = await inventoryModel.distinct("donar", {
            organisation,
        });
        // console.log(donorId);
        const donars = await userModel.find({_id: {$in: donorId}});
        
        return res.status(200).send({
            success: true,
            message: 'Donar record fetched successfully',
            donars,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in donar records",
            error,
        });
    }
};

const getHospitalController = async (req, res) => {
    try {
        const organisation = req.body.userId;
        //GET HOSPITAL ID
        const hospitalId = await inventoryModel.distinct("hospital", {
            organisation,
        });
        //FIND HOSPITAL
        const hospitals = await userModel.find({
            _id: { $in: hospitalId },
        });
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Fetched Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get Hospital API",
            error
        });
    }
};

const getOrganisationController = async (req, res) => {
    try {
        const donar = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation", { donar });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Org Data Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In ORG API",
            error,
        });
    }
};

const getOrganisationForHospitalController = async (req, res) => {
    try {
        const hospital = req.body.userId;
        const orgId = await inventoryModel.distinct("organisation", { hospital });
        //find org
        const organisations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Org Data for Hospital Fetched Successfully",
            organisations,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In ORG Hospital API",
            error,
        });
    }
};

module.exports = {
    createInventoryController, 
    getInventoryController, 
    getDonarsController, 
    getHospitalController, 
    getOrganisationController, 
    getOrganisationForHospitalController,
    getInventoryHospitalController,
};