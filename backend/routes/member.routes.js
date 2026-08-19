const express = require("express");

const router = express.Router();

const memberController = require("../controllers/member.controller");

const authMiddleware = require("../middlewares/auth.middleware");


// ============================================================
// GENERAL / ROOT ADMIN MEMBER ROUTES
// ============================================================


// ------------------------------------------------------------
// GET ALL MEMBERS
// ------------------------------------------------------------

router.get(
    "/",
    authMiddleware,
    memberController.getMembers
);



// ------------------------------------------------------------
// CREATE MEMBER
// ------------------------------------------------------------

router.post(
    "/",
    authMiddleware,
    memberController.createMember
);



// ============================================================
// SUB ROOT ADMIN ROUTES
// ============================================================


// ------------------------------------------------------------
// GET MY SUB ROOT ADMIN MEMBER
// ------------------------------------------------------------

router.get(
    "/subroot/me",
    authMiddleware,
    memberController.getSubRootAdminMember
);



// ------------------------------------------------------------
// GET ALL MEMBERS IN MY BRANCH
// ------------------------------------------------------------

router.get(
    "/subroot/branch",
    authMiddleware,
    memberController.getMyBranchMembers
);



// ------------------------------------------------------------
// GET MY DIRECT CHILDREN
// ------------------------------------------------------------

router.get(
    "/subroot/children",
    authMiddleware,
    memberController.getMyChildren
);



// ------------------------------------------------------------
// GET MY ANCESTORS
// ------------------------------------------------------------

router.get(
    "/subroot/ancestors",
    authMiddleware,
    memberController.getMyAncestors
);



// ------------------------------------------------------------
// GET MY DESCENDANTS
// ------------------------------------------------------------

router.get(
    "/subroot/descendants",
    authMiddleware,
    memberController.getMyDescendants
);


router.post(
    "/add",
    authMiddleware,
    memberController.createMemberByAdmin
);



// ------------------------------------------------------------
// GET ONE MEMBER FROM MY BRANCH
// ------------------------------------------------------------

router.get(
    "/subroot/branch/:id",
    authMiddleware,
    memberController.getMyBranchMember
);



// ------------------------------------------------------------
// UPDATE MEMBER IN MY BRANCH
// ------------------------------------------------------------

router.put(
    "/subroot/branch/:id",
    authMiddleware,
    memberController.updateMyBranchMember
);



// ------------------------------------------------------------
// DELETE MEMBER FROM MY BRANCH
// ------------------------------------------------------------

router.delete(
    "/subroot/branch/:id",
    authMiddleware,
    memberController.deleteMyBranchMember
);



// ------------------------------------------------------------
// GIVE BRANCH ADMIN PERMISSION TO MY CHILD
// ------------------------------------------------------------

router.post(
    "/subroot/children/:id/permission",
    authMiddleware,
    memberController.giveBranchPermission
);



// ============================================================
// EXISTING MEMBER ROUTES
// ============================================================


// ------------------------------------------------------------
// GET ONE MEMBER
// ------------------------------------------------------------

router.get(
    "/:id",
    authMiddleware,
    memberController.getMember
);



// ------------------------------------------------------------
// UPDATE MEMBER
// ------------------------------------------------------------

router.put(
    "/:id",
    authMiddleware,
    memberController.updateMember
);



// ------------------------------------------------------------
// DELETE MEMBER
// ------------------------------------------------------------

router.delete(
    "/:id",
    authMiddleware,
    memberController.deleteMember
);



// ------------------------------------------------------------
// ADD SPOUSE
// ------------------------------------------------------------

router.put(
    "/:id/spouse",
    authMiddleware,
    memberController.addSpouse
);



// ------------------------------------------------------------
// GET CHILDREN
// ------------------------------------------------------------

router.get(
    "/:id/children",
    authMiddleware,
    memberController.getChildren
);



// ------------------------------------------------------------
// GET SIBLINGS
// ------------------------------------------------------------

router.get(
    "/:id/siblings",
    authMiddleware,
    memberController.getSiblings
);



// ------------------------------------------------------------
// GET SPOUSE
// ------------------------------------------------------------

router.get(
    "/:id/spouse",
    authMiddleware,
    memberController.getSpouse
);



// ------------------------------------------------------------
// GET MEMBERS BY FAMILY
// ------------------------------------------------------------

router.get(
    "/family/:familyId",
    authMiddleware,
    memberController.getMembersByFamily
);



// ------------------------------------------------------------
// GIVE EXISTING PERMISSION
// ROOT ADMIN FUNCTIONALITY
// ------------------------------------------------------------

router.post(
    "/:id/permission",
    authMiddleware,
    memberController.givePermission
);



// ============================================================

module.exports = router;