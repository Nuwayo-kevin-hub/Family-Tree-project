const treeRepository = require("../repositories/tree.repository");

const getTree = async (familyId) => {
    return await treeRepository.getTree(familyId);
};

const getAncestors = async (memberId) => {
    return await treeRepository.getAncestors(memberId);
};

const getDescendants = async (memberId) => {
    return await treeRepository.getDescendants(memberId);
};

module.exports = {
    getTree,
    getAncestors,
    getDescendants
};