const notificationService =
    require("../services/notification.service");


// ========================================
// CREATE NOTIFICATION
// ========================================
const createNotification = async (req, res) => {

    try {

        const result =
            await notificationService.createNotification(
                req.body
            );

        res.status(201).json({

            success: true,

            message: "Notification created successfully",

            data: result

        });

    } catch (error) {

        console.error(
            "CREATE NOTIFICATION ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// GET MY NOTIFICATIONS
// ========================================
const getMyNotifications = async (req, res) => {

    try {

        const result =
            await notificationService.getRootAdminNotifications(
                req.user.id
            );

        res.status(200).json({

            success: true,

            data: result

        });

    } catch (error) {

        console.error(
            "GET MY NOTIFICATIONS ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
const getUnreadNotifications = async (req, res) => {

    try {

        console.log("AUTH USER:", req.user);
        console.log("ROOT ADMIN ID:", req.user?.id);

        const result =
            await notificationService.getUnreadNotifications(
                req.user.id
            );

        console.log("UNREAD RESULT:", result);

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(
            "GET UNREAD NOTIFICATIONS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ========================================
// MARK VIEWED
// ========================================
const markAsViewed = async (req, res) => {

    try {

        const result =
            await notificationService.markAsViewed(

                req.params.id,

                req.user.id

            );

        res.status(200).json({

            success: true,

            message: "Notification marked as viewed",

            data: result

        });

    } catch (error) {

        console.error(
            "MARK VIEWED ERROR:",
            error
        );

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// MARK RESPONDED
// ========================================
const markAsResponded = async (req, res) => {

    try {

        const result =
            await notificationService.markAsResponded(

                req.params.id,

                req.user.id

            );

        res.status(200).json({

            success: true,

            message: "Notification marked as responded",

            data: result

        });

    } catch (error) {

        console.error(
            "MARK RESPONDED ERROR:",
            error
        );

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


// ========================================
// DELETE
// ========================================
const deleteNotification = async (req, res) => {

    try {

        const result =
            await notificationService.deleteNotification(

                req.params.id,

                req.user.id

            );

        res.status(200).json({

            success: true,

            message: "Notification deleted",

            data: result

        });

    } catch (error) {

        console.error(
            "DELETE NOTIFICATION ERROR:",
            error
        );

        res.status(404).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {

    createNotification,

    getMyNotifications,

    getUnreadNotifications,

    markAsViewed,

    markAsResponded,

    deleteNotification

};