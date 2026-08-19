// backend/routes/index.js

const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const familyRoutes = require("./family.routes");
const memberRoutes = require("./member.routes");
const treeRoutes = require("./tree.routes");
const searchRoutes = require("./search.routes");
const dashboardRoutes = require("./dashboard.routes");
const familyRequestRoutes = require("./family_request.routes");
const notificationRoutes = require("./notification.routes");

// ============================================================
// NOTIFICATIONS
// ============================================================

router.use("/notifications", notificationRoutes);

// ============================================================
// FAMILY REQUESTS
// ============================================================

router.use("/requests", familyRequestRoutes);

// ============================================================
// DASHBOARD
// ============================================================

router.use("/dashboard", dashboardRoutes);

// ============================================================
// AUTH
// ============================================================

router.use("/auth", authRoutes);

// ============================================================
// FAMILY
// ============================================================

router.use("/family", familyRoutes);

// ============================================================
// MEMBERS
// ============================================================

router.use("/members", memberRoutes);

// ============================================================
// TREE
// ============================================================

router.use("/tree", treeRoutes);

// ============================================================
// SEARCH
// ============================================================

router.use("/search", searchRoutes);

module.exports = router;