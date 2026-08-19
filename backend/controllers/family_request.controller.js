// backend/controllers/family_request.controller.js

const familyRequestService = require("../services/family_request.service");

// ============================================================
// SEARCH FAMILIES
// ============================================================

const searchFamilies = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const result = await familyRequestService.searchFamilies(query);
        
        return res.status(200).json(result);
    } catch (error) {
        console.error("SEARCH FAMILIES ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to search families"
        });
    }
};

// ============================================================
// GET FAMILY DETAILS
// ============================================================

const getFamilyDetails = async (req, res) => {
    try {
        const { familyId } = req.params;
        
        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const result = await familyRequestService.getFamilyDetails(familyId);
        
        return res.status(200).json(result);
    } catch (error) {
        console.error("GET FAMILY DETAILS ERROR:", error);
        return res.status(404).json({
            success: false,
            message: error.message || "Family not found"
        });
    }
};

// ============================================================
// CREATE REQUEST
// ============================================================

const createRequest = async (req, res) => {
    try {
        const familyId = req.body.family_id;

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const request = await familyRequestService.createRequest({
            family_id: familyId,
            full_name: req.body.full_name,
            phone: req.body.phone,
            requester_email: req.body.email,
            description: req.body.description
        });

        return res.status(201).json({
            success: true,
            message: "Family request submitted successfully",
            data: request
        });
    } catch (error) {
        console.error("CREATE REQUEST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create family request"
        });
    }
};

// ============================================================
// GET ALL REQUESTS
// ============================================================

const getRequests = async (req, res) => {
    try {
        const familyId = req.user?.family_id;

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const requests = await familyRequestService.getRequests(familyId);

        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error("GET REQUESTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get requests"
        });
    }
};

// ============================================================
// GET ONE REQUEST
// ============================================================

const getRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const familyId = req.user?.family_id;

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const request = await familyRequestService.getRequest(requestId, familyId);

        return res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error("GET REQUEST ERROR:", error);
        return res.status(404).json({
            success: false,
            message: error.message || "Request not found"
        });
    }
};

// ============================================================
// APPROVE REQUEST
// ============================================================

const approveRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.user?.id;
        const familyId = req.user?.family_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const result = await familyRequestService.approveRequest(requestId, userId, familyId);

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("APPROVE REQUEST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to approve request"
        });
    }
};

// ============================================================
// REJECT REQUEST
// ============================================================

const rejectRequest = async (req, res) => {
    try {
        const requestId = req.params.id;
        const userId = req.user?.id;
        const familyId = req.user?.family_id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const result = await familyRequestService.rejectRequest(requestId, userId, familyId);

        return res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        console.error("REJECT REQUEST ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to reject request"
        });
    }
};

// ============================================================
// GET PENDING REQUESTS
// ============================================================

const getPendingRequests = async (req, res) => {
    try {
        const familyId = req.user?.family_id;

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const requests = await familyRequestService.getPendingRequests(familyId);

        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error("GET PENDING REQUESTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get pending requests"
        });
    }
};

// ============================================================
// GET UNVIEWED PENDING REQUESTS
// ============================================================

const getUnviewedPendingRequests = async (req, res) => {
    try {
        const familyId = req.user?.family_id;

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const requests = await familyRequestService.getUnviewedPendingRequests(familyId);

        return res.status(200).json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error("GET UNVIEWED REQUESTS ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to get unviewed requests"
        });
    }
};

// ============================================================
// MARK REQUEST AS VIEWED
// ============================================================

const markRequestViewed = async (req, res) => {
    try {
        const requestId = req.params.id;
        const familyId = req.user?.family_id;

        if (!familyId) {
            return res.status(400).json({
                success: false,
                message: "Family ID is required"
            });
        }

        const request = await familyRequestService.markRequestViewed(requestId, familyId);

        return res.status(200).json({
            success: true,
            data: request
        });
    } catch (error) {
        console.error("MARK REQUEST VIEWED ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to mark request as viewed"
        });
    }
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
    approveRequest,
    rejectRequest,
    getPendingRequests,
    getUnviewedPendingRequests,
    markRequestViewed
};