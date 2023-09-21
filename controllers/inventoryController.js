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

module.exports = { createInventoryController, getInventoryController, getDonarsController };