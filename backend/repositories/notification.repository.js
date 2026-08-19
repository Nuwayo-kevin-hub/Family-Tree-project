const db = require("../config/database");

// ========================================
// CREATE NOTIFICATION
// ========================================
const createNotification = async (data) => {

    const result = await db.query(
        `
        INSERT INTO notifications
        (
            member_id,
            title,
            message,
            is_read,
            created_at
        )
        VALUES
        (
            $1,
            $2,
            $3,
            false,
            NOW()
        )
        RETURNING *
        `,
        [
            data.member_id,
            data.title,
            data.message
        ]
    );

    return result.rows[0];
};


// ========================================
// GET ALL NOTIFICATIONS FOR MEMBER
// ========================================
const getNotifications = async (memberId) => {

    const result = await db.query(
        `
        SELECT *
        FROM notifications
        WHERE member_id = $1
        ORDER BY created_at DESC
        `,
        [memberId]
    );

    return result.rows;
};


// ========================================
// GET UNREAD NOTIFICATIONS
// ========================================
const getUnreadNotifications = async (memberId) => {

    const result = await db.query(
        `
        SELECT *
        FROM notifications
        WHERE member_id = $1
        AND is_read = false
        ORDER BY created_at DESC
        `,
        [memberId]
    );

    return result.rows;
};


// ========================================
// GET ONE NOTIFICATION
// ========================================
const getNotification = async (id, memberId) => {

    const result = await db.query(
        `
        SELECT *
        FROM notifications
        WHERE id = $1
        AND member_id = $2
        `,
        [id, memberId]
    );

    return result.rows[0] || null;
};


// ========================================
// MARK ONE AS READ
// ========================================
const markNotificationRead = async (id, memberId) => {

    const result = await db.query(
        `
        UPDATE notifications
        SET is_read = true
        WHERE id = $1
        AND member_id = $2
        RETURNING *
        `,
        [id, memberId]
    );

    return result.rows[0] || null;
};


// ========================================
// MARK ALL AS READ
// ========================================
const markAllNotificationsRead = async (memberId) => {

    const result = await db.query(
        `
        UPDATE notifications
        SET is_read = true
        WHERE member_id = $1
        AND is_read = false
        RETURNING *
        `,
        [memberId]
    );

    return result.rows;
};


// ========================================
// DELETE ONE NOTIFICATION
// ========================================
const deleteNotification = async (id, memberId) => {

    const result = await db.query(
        `
        DELETE FROM notifications
        WHERE id = $1
        AND member_id = $2
        RETURNING *
        `,
        [id, memberId]
    );

    return result.rows[0] || null;
};


// ========================================
// DELETE ALL READ NOTIFICATIONS
// ========================================
const deleteReadNotifications = async (memberId) => {

    const result = await db.query(
        `
        DELETE FROM notifications
        WHERE member_id = $1
        AND is_read = true
        RETURNING *
        `,
        [memberId]
    );

    return result.rows;
};


module.exports = {

    createNotification,

    getNotifications,

    getUnreadNotifications,

    getNotification,

    markNotificationRead,

    markAllNotificationsRead,

    deleteNotification,

    deleteReadNotifications

};