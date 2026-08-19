import api from "./axios";

// ============================================
// CREATE NOTIFICATION
// ============================================
export const createNotification = async (data) => {
    const response = await api.post(
        "/notifications",
        data
    );

    return response.data;
};

// ============================================
// GET MY NOTIFICATIONS
// ROOT ADMIN
// ============================================
export const getNotifications = async () => {
    const response = await api.get(
        "/notifications/my"
    );

    return response.data;
};

// ============================================
// GET MY NOTIFICATIONS
// Alias
// ============================================
export const getMyNotifications = async () => {
    const response = await api.get(
        "/notifications/my"
    );

    return response.data;
};

// ============================================
// GET UNREAD NOTIFICATIONS
// Used by NavBar badge
// ============================================
export const getUnreadNotifications = async () => {
    const response = await api.get(
        "/notifications/unread"
    );

    return response.data;
};

// ============================================
// MARK NOTIFICATION AS VIEWED
// ============================================
export const markNotificationViewed = async (id) => {
    const response = await api.put(
        `/notifications/${id}/view`
    );

    return response.data;
};

// ============================================
// MARK NOTIFICATION AS RESPONDED
// ============================================
export const markNotificationResponded = async (id) => {
    const response = await api.put(
        `/notifications/${id}/respond`
    );

    return response.data;
};