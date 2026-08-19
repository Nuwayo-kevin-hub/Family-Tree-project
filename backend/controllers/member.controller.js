const memberService = require("../services/member.service");


// GET ALL MEMBERS

const getMembers = async(req,res)=>{

    try{

        const result = await memberService.getMembers();

        res.status(200).json(result);

    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// GET ONE MEMBER

const getMember = async(req,res)=>{

    try{

        const result = await memberService.getMember(
            req.params.id
        );


        if(!result){

            return res.status(404).json({

                success:false,
                message:"Member not found"

            });

        }


        res.status(200).json(result);

    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// CREATE MEMBER

const createMember = async(req,res)=>{

    try{


        const result = await memberService.createMember(
            req.body
        );


        res.status(201).json({

            success:true,
            message:"Member created successfully",
            data:result

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// UPDATE MEMBER

const updateMember = async(req,res)=>{

    try{


        const result = await memberService.updateMember(

            req.params.id,

            req.body

        );


        res.status(200).json({

            success:true,
            data:result

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// DELETE MEMBER

const deleteMember = async(req,res)=>{

    try{


        const result = await memberService.deleteMember(

            req.params.id

        );


        res.status(200).json({

            success:true,
            data:result

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// ADD SPOUSE

const addSpouse = async(req,res)=>{

    try{


        const result = await memberService.addSpouse(

            req.params.id,

            req.body.spouse_id

        );


        res.status(200).json({

            success:true,
            message:"Spouse added",
            data:result

        });


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// GET CHILDREN

const getChildren = async(req,res)=>{

    try{


        const result = await memberService.getChildren(

            req.params.id

        );


        res.status(200).json(result);


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// GET SIBLINGS

const getSiblings = async(req,res)=>{

    try{


        const result = await memberService.getSiblings(

            req.params.id

        );


        res.status(200).json(result);


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// GET SPOUSE

const getSpouse = async(req,res)=>{

    try{


        const result = await memberService.getSpouse(

            req.params.id

        );


        res.status(200).json(result);


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// GET MEMBERS BY FAMILY

const getMembersByFamily = async(req,res)=>{

    try{


        const result = await memberService.getMembersByFamily(

            req.params.familyId

        );


        res.status(200).json(result);


    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



const givePermission = async(req,res)=>{


try{


const result =
await memberService.givePermission(

    req.params.id,

    req.body

);



res.status(200).json({

success:true,

message:"Permission granted",

data:result

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};

// ============================================================
// SUB ROOT ADMIN CONTROLLERS
// ============================================================


// ------------------------------------------------------------
// GET SUB ROOT ADMIN MEMBER
// ------------------------------------------------------------

const getSubRootAdminMember = async (req, res) => {

    try {

        const result =
            await memberService.getSubRootAdminMember(
                req.user.id
            );

        if (!result) {

            return res.status(404).json({

                success: false,

                message: "Sub Root Admin member not found"

            });

        }

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// GET MY BRANCH MEMBERS
// ------------------------------------------------------------

const getMyBranchMembers = async (req, res) => {

    try {

        const result =
            await memberService.getMyBranchMembers(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// GET ONE MEMBER FROM MY BRANCH
// ------------------------------------------------------------

const getMyBranchMember = async (req, res) => {

    try {

        const result =
            await memberService.getMyBranchMember(

                req.user.id,

                req.params.id

            );

        if (!result) {

            return res.status(404).json({

                success: false,

                message:
                    "Member not found in your branch"

            });

        }

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// UPDATE MY BRANCH MEMBER
// ------------------------------------------------------------

const updateMyBranchMember = async (req, res) => {

    try {

        const result =
            await memberService.updateMyBranchMember(

                req.user.id,

                req.params.id,

                req.body

            );

        res.status(200).json({

            success: true,

            message:
                "Branch member updated successfully",

            data: result

        });

    }
    catch (error) {

        res.status(403).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// DELETE MY BRANCH MEMBER
// ------------------------------------------------------------

const deleteMyBranchMember = async (req, res) => {

    try {

        const result =
            await memberService.deleteMyBranchMember(

                req.user.id,

                req.params.id

            );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(403).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// GET MY DIRECT CHILDREN
// ------------------------------------------------------------

const getMyChildren = async (req, res) => {

    try {

        const result =
            await memberService.getMyChildren(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// GIVE BRANCH ADMIN PERMISSION
// ------------------------------------------------------------

const giveBranchPermission = async (req, res) => {

    try {

        const result =
            await memberService.giveBranchPermission(

                req.user.id,

                req.params.id,

                req.body

            );

        res.status(200).json({

            success: true,

            message:
                "Branch Admin permission granted",

            data: result

        });

    }
    catch (error) {

        res.status(403).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// GET MY ANCESTORS
// ------------------------------------------------------------

const getMyAncestors = async (req, res) => {

    try {

        const result =
            await memberService.getMyAncestors(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};



// ------------------------------------------------------------
// GET MY DESCENDANTS
// ------------------------------------------------------------

const getMyDescendants = async (req, res) => {

    try {

        const result =
            await memberService.getMyDescendants(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    }
    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// ============================================================
// CREATE MEMBER BY ROOT ADMIN OR SUB ROOT ADMIN
// ============================================================
const createMemberByAdmin = async (req, res) => {
    try {

        console.log("REQ.USER:", req.user);

        const adminUserId = req.user.id;

        console.log("ADMIN USER ID:", adminUserId);

        console.log("MEMBER DATA:", req.body);

        const result =
            await memberService.createMemberByAdmin(
                req.body,
                adminUserId
            );

        return res.status(201).json({
            success: true,
            message: "Family member created successfully.",
            data: result
        });

    } catch (error) {

        console.error(
            "CREATE MEMBER BY ADMIN ERROR:",
            error
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {

    getMembers,
    getMember,
    createMember,
    updateMember,
    deleteMember,
    addSpouse,
    getChildren,
    getSiblings,
    getSpouse,
    getMembersByFamily,
    givePermission,
    


    // ========================================================
    // SUB ROOT ADMIN
    // ========================================================

    getSubRootAdminMember,

    getMyBranchMembers,

    getMyBranchMember,

    updateMyBranchMember,

    deleteMyBranchMember,

    getMyChildren,

    giveBranchPermission,

    getMyAncestors,

    getMyDescendants,
    createMemberByAdmin

};