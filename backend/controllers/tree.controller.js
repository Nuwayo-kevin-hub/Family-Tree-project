const treeService = require("../services/tree.service");

const getTree = async (req, res) => {
    try {

        const result = await treeService.getTree(req.params.familyId);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getAncestors = async (req, res) => {
    try {

        const result = await treeService.getAncestors(req.params.memberId);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getDescendants = async (req, res) => {
    try {

        const result = await treeService.getDescendants(req.params.memberId);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    getTree,
    getAncestors,
    getDescendants
};