const marriageService = require("../services/marriage.service");

const checkRelationship = async (req, res) => {
    try {

        const result = await marriageService.checkRelationship(req.body);

        return res.status(200).json(result);

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    checkRelationship
};