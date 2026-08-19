// backend/repositories/family_request.repository.js

const pool = require("../config/database");

// ============================================================
// CREATE REQUEST
// ============================================================

const createRequest = async (data) => {
    if (!data.family_id) {
        throw new Error("Family ID is required");
    }

    // VERIFY FAMILY EXISTS
    const familyResult = await pool.query(
        `
        SELECT id, family_name
        FROM families
        WHERE id = $1
        LIMIT 1
        `,
        [data.family_id]
    );

    if (familyResult.rows.length === 0) {
        throw new Error("Selected family does not exist");
    }

    const result = await pool.query(
        `
        INSERT INTO family_requests
        (
            family_id,
            requester_name,
            requester_phone,
            requester_email,
            message,
            status,
            created_at
        )
        VALUES ($1, $2, $3, $4, $5, 'PENDING', NOW())
        RETURNING *
        `,
        [
            data.family_id,
            data.requester_name || null,
            data.requester_phone || null,
            data.requester_email || null,
            data.message || null
        ]
    );

    return result.rows[0];
};

// ============================================================
// GET REQUESTS FOR ONE FAMILY
// ============================================================

const getRequestsByFamily = async (familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        SELECT
            fr.*,
            f.family_name
        FROM family_requests fr
        INNER JOIN families f ON f.id = fr.family_id
        WHERE fr.family_id = $1
        ORDER BY fr.created_at DESC
        `,
        [familyId]
    );

    return result.rows;
};

// ============================================================
// GET PENDING REQUESTS FOR ONE FAMILY
// ============================================================

const getPendingRequestsByFamily = async (familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        SELECT
            fr.*,
            f.family_name
        FROM family_requests fr
        INNER JOIN families f ON f.id = fr.family_id
        WHERE fr.family_id = $1
        AND fr.status = 'PENDING'
        ORDER BY fr.created_at DESC
        `,
        [familyId]
    );

    return result.rows;
};

// ============================================================
// GET ONE REQUEST
// ============================================================

const getRequest = async (id, familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        SELECT
            fr.*,
            f.family_name
        FROM family_requests fr
        INNER JOIN families f ON f.id = fr.family_id
        WHERE fr.id = $1
        AND fr.family_id = $2
        LIMIT 1
        `,
        [id, familyId]
    );

    return result.rows[0] || null;
};

// ============================================================
// APPROVE REQUEST
// ============================================================

const approveRequest = async (id, familyId, userId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        UPDATE family_requests
        SET
            status = 'APPROVED',
            reviewed_by = $1,
            reviewed_at = NOW()
        WHERE id = $2
        AND family_id = $3
        AND status = 'PENDING'
        RETURNING *
        `,
        [userId, id, familyId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// ============================================================
// REJECT REQUEST
// ============================================================

const rejectRequest = async (id, familyId, userId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        UPDATE family_requests
        SET
            status = 'REJECTED',
            reviewed_by = $1,
            reviewed_at = NOW()
        WHERE id = $2
        AND family_id = $3
        AND status = 'PENDING'
        RETURNING *
        `,
        [userId, id, familyId]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// ============================================================
// GET UNVIEWED PENDING REQUESTS
// ============================================================

const getUnviewedPendingRequests = async (familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        SELECT
            fr.*,
            f.family_name
        FROM family_requests fr
        INNER JOIN families f ON f.id = fr.family_id
        WHERE fr.family_id = $1
        AND fr.status = 'PENDING'
        AND fr.viewed_at IS NULL
        ORDER BY fr.created_at DESC
        `,
        [familyId]
    );

    return result.rows;
};

// ============================================================
// MARK REQUEST AS VIEWED
// ============================================================

const markRequestViewed = async (id, familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await pool.query(
        `
        UPDATE family_requests
        SET viewed_at = NOW()
        WHERE id = $1
        AND family_id = $2
        RETURNING *
        `,
        [id, familyId]
    );

    return result.rows[0] || null;
};

// ============================================================
// SEARCH FAMILIES BY NAME
// ============================================================

const searchFamiliesByName = async (searchTerm) => {
    const result = await pool.query(
        `
        SELECT 
            f.id,
            f.family_name,
            f.family_origin,
            f.family_description,
            f.status,
            f.created_at,
            u.username as founder_username
        FROM families f
        LEFT JOIN users u ON u.id = f.created_by
        WHERE f.family_name ILIKE $1
        AND f.status = 'ACTIVE'
        ORDER BY f.family_name ASC
        LIMIT 20
        `,
        [`%${searchTerm}%`]
    );
    return result.rows;
};

// ============================================================
// GET FAMILY BY ID
// ============================================================

const getFamilyById = async (familyId) => {
    const result = await pool.query(
        `
        SELECT 
            f.id,
            f.family_name,
            f.family_origin,
            f.family_description,
            f.created_by,
            f.status,
            f.created_at,
            u.username as founder_username
        FROM families f
        LEFT JOIN users u ON u.id = f.created_by
        WHERE f.id = $1
        `,
        [familyId]
    );
    return result.rows[0] || null;
};

// ============================================================
// GET ROOT ADMIN BY FAMILY ID
// ============================================================

const getRootAdminByFamilyId = async (familyId) => {
    const result = await pool.query(
        `
        SELECT 
            u.id,
            u.username,
            u.email,
            m.role,
            m.id as member_id,
            m.first_name,
            m.last_name
        FROM users u
        JOIN members m ON m.id = u.member_id
        WHERE m.family_id = $1
        AND m.role = 'ROOT_ADMIN'
        LIMIT 1
        `,
        [familyId]
    );
    return result.rows[0] || null;
};

// ============================================================
// CHECK IF REQUEST ALREADY EXISTS
// ============================================================

const checkExistingRequest = async (email, familyId) => {
    const result = await pool.query(
        `
        SELECT id, status
        FROM family_requests
        WHERE requester_email = $1
        AND family_id = $2
        AND status IN ('PENDING', 'APPROVED')
        `,
        [email, familyId]
    );
    return result.rows[0] || null;
};

// ============================================================
// CREATE NOTIFICATION
// ============================================================

const createNotification = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO notifications (
            user_id,
            title,
            message,
            type,
            is_read,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id
        `,
        [
            data.user_id,
            data.title,
            data.message,
            data.type || 'FAMILY_REQUEST',
            data.is_read || false
        ]
    );
    return result.rows[0];
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    createRequest,
    getRequestsByFamily,
    getPendingRequestsByFamily,
    getRequest,
    approveRequest,
    rejectRequest,
    getUnviewedPendingRequests,
    markRequestViewed,
    searchFamiliesByName,
    getFamilyById,
    getRootAdminByFamilyId,
    checkExistingRequest,
    createNotification
};