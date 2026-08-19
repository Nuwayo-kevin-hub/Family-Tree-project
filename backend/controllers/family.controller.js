// backend/controllers/family.controller.js

const familyService = require("../services/family.service");
const familyRepository = require("../repositories/family.repository");

// ============================================================
// GET ALL FAMILIES
// ============================================================

const getFamilies = async (req, res) => {
    try {
        const result = await familyService.getFamilies();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// GET ONE FAMILY
// ============================================================

const getFamily = async (req, res) => {
    try {
        const result = await familyService.getFamily(req.params.id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Family not found"
            });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// REGISTER COMPLETE FAMILY
// ============================================================

const registerFamily = async (req, res) => {
    try {
        const result = await familyService.registerFamily(req.body);

        res.status(201).json({
            success: true,
            message: "Registration completed successfully",
            data: result
        });
    } catch (error) {
        console.error("REGISTER FAMILY ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// CREATE FAMILY
// ============================================================

const createFamily = async (req, res) => {
    try {
        const result = await familyService.createFamily(req.body);

        res.status(201).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// UPDATE FAMILY
// ============================================================

const updateFamily = async (req, res) => {
    try {
        const result = await familyService.updateFamily(req.params.id, req.body);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// DELETE FAMILY
// ============================================================

const deleteFamily = async (req, res) => {
    try {
        const result = await familyService.deleteFamily(req.params.id);

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================================
// GET FAMILY MEMBERS
// ============================================================

const getFamilyMembers = async (req, res) => {
    try {
        const result = await familyService.getFamilyMembers(req.params.familyId);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

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

        // Use repository directly or service if you have it
        const families = await familyRepository.searchFamiliesByName(query);

        res.status(200).json({
            success: true,
            count: families.length,
            data: families
        });
    } catch (error) {
        console.error("SEARCH FAMILIES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to search families"
        });
    }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    registerFamily,
    getFamilies,
    getFamily,
    createFamily,
    updateFamily,
    deleteFamily,
    getFamilyMembers,
    searchFamilies
};