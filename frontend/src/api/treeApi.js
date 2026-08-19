import api from "./axios";


// ==========================
// GET COMPLETE FAMILY TREE
// ==========================
export const getFamilyTree = async (familyId) => {

    const response = await api.get(
        `/tree/${familyId}`
    );

    return response.data;

};


// ==========================
// GET ANCESTORS
// ==========================
export const getAncestors = async (memberId) => {

    const response = await api.get(
        `/tree/ancestors/${memberId}`
    );

    return response.data;

};


// ==========================
// GET DESCENDANTS
// ==========================
export const getDescendants = async (memberId) => {

    const response = await api.get(
        `/tree/descendants/${memberId}`
    );

    return response.data;

};


const treeApi = {

    getFamilyTree,
    getAncestors,
    getDescendants

};

export default treeApi;