const express = require("express");

const router = express.Router();

const notificationController =
    require("../controllers/notification.controller");

const authMiddleware =
    require("../middlewares/auth.middleware");


// ========================================
// CREATE NOTIFICATION
// ========================================
router.post(
    "/",
    authMiddleware,
    notificationController.createNotification
);


// ========================================
// GET MY NOTIFICATIONS
// ========================================
router.get(
    "/my",
    authMiddleware,
    notificationController.getMyNotifications
);


// ========================================
// GET UNREAD
// Navbar uses this
// ========================================
router.get(
    "/unread",
    authMiddleware,
    notificationController.getUnreadNotifications
);


// ========================================
// MARK VIEWED
// ========================================
router.put(
    "/:id/view",
    authMiddleware,
    notificationController.markAsViewed
);


// ========================================
// MARK RESPONDED
// ========================================
router.put(
    "/:id/respond",
    authMiddleware,
    notificationController.markAsResponded
);


// ========================================
// DELETE
// ========================================
router.delete(
    "/:id",
    authMiddleware,
    notificationController.deleteNotification
);


module.exports = router;