// backend/services/family_request.service.js

const familyRequestRepository = require("../repositories/family_request.repository");

// ============================================================
// SEARCH FAMILIES
// ============================================================

const searchFamilies = async (searchTerm) => {
    if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error("Please enter at least 2 characters to search");
    }

    const families = await familyRequestRepository.searchFamiliesByName(searchTerm.trim());

    return {
        success: true,
        count: families.length,
        families: families.map(family => ({
            id: family.id,
            name: family.family_name,
            origin: family.family_origin || null,
            description: family.family_description || null,
            founder: family.founder_username || 'Unknown',
            status: family.status,
            created_at: family.created_at
        }))
    };
};

// ============================================================
// GET FAMILY DETAILS
// ============================================================

const getFamilyDetails = async (familyId) => {
    const family = await familyRequestRepository.getFamilyById(familyId);
    
    if (!family) {
        throw new Error("Family not found");
    }

    return {
        success: true,
        family: {
            id: family.id,
            name: family.family_name,
            origin: family.family_origin || null,
            description: family.family_description || null,
            founder: family.founder_username || 'Unknown',
            status: family.status,
            created_at: family.created_at
        }
    };
};

// ============================================================
// CREATE FAMILY REQUEST
// ============================================================

const createRequest = async (data) => {
    if (!data) {
        throw new Error("Request data is required");
    }

    // Validate required fields
    if (!data.full_name) {
        throw new Error("Full name is required");
    }
    if (!data.requester_email) {
        throw new Error("Email is required");
    }
    if (!data.family_id) {
        throw new Error("Family ID is required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.requester_email)) {
        throw new Error("Please enter a valid email address");
    }

    // Check if family exists
    const family = await familyRequestRepository.getFamilyById(data.family_id);
    if (!family) {
        throw new Error("Family not found");
    }

    // Check if request already exists
    const existingRequest = await familyRequestRepository.checkExistingRequest(
        data.requester_email,
        data.family_id
    );

    if (existingRequest) {
        throw new Error(`You already have a ${existingRequest.status.toLowerCase()} request for this family`);
    }

    // Create the request
    const request = await familyRequestRepository.createRequest({
        family_id: data.family_id,
        requester_name: data.full_name,
        requester_phone: data.phone || null,
        requester_email: data.requester_email,
        message: data.description || null
    });

    // Get root admin for notification
    const rootAdmin = await familyRequestRepository.getRootAdminByFamilyId(data.family_id);
    if (rootAdmin) {
        const adminName = rootAdmin.username || rootAdmin.first_name || 'Admin';
        
        await familyRequestRepository.createNotification({
            user_id: rootAdmin.id,
            title: "New Family Join Request",
            message: `${data.full_name} wants to join your family "${family.family_name}"`,
            type: 'FAMILY_REQUEST'
        });
    }

    return request;
};

// ============================================================
// GET ALL REQUESTS
// ============================================================

const getRequests = async (familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    return await familyRequestRepository.getRequestsByFamily(familyId);
};

// ============================================================
// GET ONE REQUEST
// ============================================================

const getRequest = async (id, familyId) => {
    if (!id) {
        throw new Error("Request ID is required");
    }
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const request = await familyRequestRepository.getRequest(id, familyId);
    if (!request) {
        throw new Error("Request not found");
    }

    return request;
};

// ============================================================
// GET PENDING REQUESTS
// ============================================================

const getPendingRequests = async (familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    return await familyRequestRepository.getPendingRequestsByFamily(familyId);
};

// ============================================================
// GET UNVIEWED PENDING REQUESTS
// ============================================================

const getUnviewedPendingRequests = async (familyId) => {
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    return await familyRequestRepository.getUnviewedPendingRequests(familyId);
};

// ============================================================
// APPROVE REQUEST
// ============================================================

const approveRequest = async (id, userId, familyId) => {
    if (!id) {
        throw new Error("Request ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await familyRequestRepository.approveRequest(id, familyId, userId);
    if (!result) {
        throw new Error("Request not found or already processed");
    }

    return {
        message: "Request approved successfully",
        request: result
    };
};

// ============================================================
// REJECT REQUEST
// ============================================================

const rejectRequest = async (id, userId, familyId) => {
    if (!id) {
        throw new Error("Request ID is required");
    }
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const result = await familyRequestRepository.rejectRequest(id, familyId, userId);
    if (!result) {
        throw new Error("Request not found or already processed");
    }

    return {
        message: "Request rejected successfully",
        request: result
    };
};

// ============================================================
// MARK REQUEST AS VIEWED
// ============================================================

const markRequestViewed = async (id, familyId) => {
    if (!id) {
        throw new Error("Request ID is required");
    }
    if (!familyId) {
        throw new Error("Family ID is required");
    }

    const request = await familyRequestRepository.markRequestViewed(id, familyId);
    if (!request) {
        throw new Error("Request not found");
    }

    return request;
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    searchFamilies,
    getFamilyDetails,
    createRequest,
    getRequests,
    getRequest,
    getPendingRequests,
    getUnviewedPendingRequests,
    approveRequest,
    rejectRequest,
    markRequestViewed
};