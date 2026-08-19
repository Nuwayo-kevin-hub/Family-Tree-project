const memberRepository = require("../repositories/member.repository");


// GET ALL MEMBERS

const getMembers = async()=>{

    return await memberRepository.getMembers();

};



// GET ONE MEMBER

const getMember = async(id)=>{

    return await memberRepository.getMember(id);

};



// CREATE MEMBER

const createMember = async(data)=>{

    return await memberRepository.createMember(data);

};



// UPDATE MEMBER

const updateMember = async(id,data)=>{

    return await memberRepository.updateMember(
        id,
        data
    );

};



// DELETE MEMBER

const deleteMember = async(id)=>{

    return await memberRepository.deleteMember(id);

};



// ADD SPOUSE

const addSpouse = async(memberId,spouseId)=>{

    return await memberRepository.addSpouse(
        memberId,
        spouseId
    );

};



// GET CHILDREN

const getChildren = async(memberId)=>{

    return await memberRepository.getChildren(
        memberId
    );

};



// GET SIBLINGS

const getSiblings = async(memberId)=>{

    return await memberRepository.getSiblings(
        memberId
    );

};



// GET SPOUSE

const getSpouse = async(memberId)=>{

    return await memberRepository.getSpouse(
        memberId
    );

};



// GET MEMBERS BY FAMILY

const getMembersByFamily = async(familyId)=>{

    return await memberRepository.getMembersByFamily(
        familyId
    );

};



const givePermission = async(memberId,data)=>{


    return await memberRepository.givePermission(
        memberId,
        data
    );


};


// ============================================================
// SUB ROOT ADMIN SERVICES
// ============================================================


// ------------------------------------------------------------
// GET SUB ROOT ADMIN MEMBER
// ------------------------------------------------------------

const getSubRootAdminMember = async (userId) => {

    return await memberRepository.getSubRootAdminMember(
        userId
    );

};



// ------------------------------------------------------------
// GET ALL MEMBERS IN MY BRANCH
// ------------------------------------------------------------

const getMyBranchMembers = async (userId) => {

    return await memberRepository.getMyBranchMembers(
        userId
    );

};



// ------------------------------------------------------------
// GET ONE MEMBER FROM MY BRANCH
// ------------------------------------------------------------

const getMyBranchMember = async (
    userId,
    memberId
) => {

    return await memberRepository.getMyBranchMember(
        userId,
        memberId
    );

};



// ------------------------------------------------------------
// UPDATE MEMBER IN MY BRANCH
// ------------------------------------------------------------

const updateMyBranchMember = async (
    userId,
    memberId,
    data
) => {

    return await memberRepository.updateMyBranchMember(
        userId,
        memberId,
        data
    );

};



// ------------------------------------------------------------
// DELETE MEMBER FROM MY BRANCH
// ------------------------------------------------------------

const deleteMyBranchMember = async (
    userId,
    memberId
) => {

    return await memberRepository.deleteMyBranchMember(
        userId,
        memberId
    );

};



// ------------------------------------------------------------
// GET MY DIRECT CHILDREN
// ------------------------------------------------------------

const getMyChildren = async (userId) => {

    return await memberRepository.getMyChildren(
        userId
    );

};



// ------------------------------------------------------------
// GIVE BRANCH ADMIN PERMISSION
// ------------------------------------------------------------

const giveBranchPermission = async (
    userId,
    memberId,
    data
) => {

    return await memberRepository.giveBranchPermission(
        userId,
        memberId,
        data
    );

};



// ------------------------------------------------------------
// GET MY ANCESTORS
// ------------------------------------------------------------

const getMyAncestors = async (userId) => {

    return await memberRepository.getMyAncestors(
        userId
    );

};



// ------------------------------------------------------------
// GET MY DESCENDANTS
// ------------------------------------------------------------

const getMyDescendants = async (userId) => {

    return await memberRepository.getMyDescendants(
        userId
    );

};

// ROOT ADMIN CREATE MEMBER
// ============================================================
// CREATE MEMBER BY ROOT OR SUB ROOT ADMIN
// ============================================================

const createMemberByAdmin = async (
    data,
    adminUserId
) => {

    return await memberRepository.createMemberByAdmin({

        data,

        adminUserId

    });

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
    // SUB ROOT ADMIN FUNCTIONS
    // ========================================================

    getSubRootAdminMember,
    createMemberByAdmin,

    getMyBranchMembers,

    getMyBranchMember,

    updateMyBranchMember,

    deleteMyBranchMember,

    getMyChildren,

    giveBranchPermission,

    getMyAncestors,

    getMyDescendants

};