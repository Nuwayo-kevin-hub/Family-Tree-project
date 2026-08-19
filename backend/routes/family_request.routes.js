// backend/routes/family_request.routes.js

const express = require("express");
const router = express.Router();

const familyRequestController = require("../controllers/family_request.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// ============================================================
// PUBLIC ROUTES (No authentication required)
// ============================================================

// Search families by name (for lost family members)
router.get("/search", familyRequestController.searchFamilies);

// Get family details by ID
router.get("/family/:familyId", familyRequestController.getFamilyDetails);

// CREATE LOST FAMILY REQUEST (Public)
router.post("/", familyRequestController.createRequest);

// ============================================================
// PROTECTED ROUTES (Authentication required)
// ============================================================

// GET ALL REQUESTS FOR ROOT ADMIN (by family_id from token)
router.get(
    "/my-requests",
    authMiddleware,
    familyRequestController.getRequests
);

// GET ONE REQUEST
router.get(
    "/:id",
    authMiddleware,
    familyRequestController.getRequest
);

// GET PENDING REQUESTS
router.get(
    "/pending/list",
    authMiddleware,
    familyRequestController.getPendingRequests
);

// GET UNVIEWED PENDING REQUESTS
router.get(
    "/pending/unviewed",
    authMiddleware,
    familyRequestController.getUnviewedPendingRequests
);

// APPROVE REQUEST
router.put(
    "/:id/approve",
    authMiddleware,
    familyRequestController.approveRequest
);

// REJECT REQUEST
router.put(
    "/:id/reject",
    authMiddleware,
    familyRequestController.rejectRequest
);

// MARK REQUEST AS VIEWED
router.put(
    "/:id/view",
    authMiddleware,
    familyRequestController.markRequestViewed
);

module.exports = router;