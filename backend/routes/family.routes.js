// backend/routes/family.routes.js

const express = require("express");
const router = express.Router();

const familyController = require("../controllers/family.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// ============================================================
// FAMILY ROUTES
// ============================================================

// GET ALL FAMILIES
router.get("/", authMiddleware, familyController.getFamilies);

// GET ONE FAMILY
router.get("/:id", authMiddleware, familyController.getFamily);

// REGISTER FAMILY (Public - no auth needed)
router.post("/register", familyController.registerFamily);

// CREATE FAMILY
router.post("/", familyController.createFamily);

// UPDATE FAMILY
router.put("/:id", authMiddleware, familyController.updateFamily);

// DELETE FAMILY
router.delete("/:id", authMiddleware, familyController.deleteFamily);

// GET MEMBERS OF FAMILY
router.get("/:familyId/members", authMiddleware, familyController.getFamilyMembers);

module.exports = router;