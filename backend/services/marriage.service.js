const marriageRepository = require("../repositories/marriage.repository");

const checkRelationship = async (data) => {
    return await marriageRepository.checkRelationship(data);
};

module.exports = {
    checkRelationship
};