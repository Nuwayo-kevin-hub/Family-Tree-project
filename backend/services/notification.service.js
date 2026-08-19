const notificationRepository =
    require("../repositories/notification.repository");


// ========================================
// CREATE
// ========================================
const createNotification = async (data) => {

    return await notificationRepository.createNotification(
        data
    );

};


// ========================================
// GET MY NOTIFICATIONS
// ========================================
const getRootAdminNotifications = async (rootAdminId) => {

    return await notificationRepository.getRootAdminNotifications(
        rootAdminId
    );

};


// ========================================
// GET UNREAD
// ========================================
const getUnreadNotifications = async (rootAdminId) => {

    return await notificationRepository.getUnreadNotifications(
        rootAdminId
    );

};


// ========================================
// MARK VIEWED
// ========================================
const markAsViewed = async (id, rootAdminId) => {

    const notification =
        await notificationRepository.markAsViewed(
            id,
            rootAdminId
        );

    if (!notification) {

        throw new Error(
            "Notification not found"
        );

    }

    return notification;

};


// ========================================
// MARK RESPONDED
// ========================================
const markAsResponded = async (id, rootAdminId) => {

    const notification =
        await notificationRepository.markAsResponded(
            id,
            rootAdminId
        );

    if (!notification) {

        throw new Error(
            "Notification not found"
        );

    }

    return notification;

};


// ========================================
// DELETE
// ========================================
const deleteNotification = async (id, rootAdminId) => {

    const notification =
        await notificationRepository.deleteNotification(
            id,
            rootAdminId
        );

    if (!notification) {

        throw new Error(
            "Notification not found"
        );

    }

    return notification;

};


module.exports = {

    createNotification,

    getRootAdminNotifications,

    getUnreadNotifications,

    markAsViewed,

    markAsResponded,

    deleteNotification

};