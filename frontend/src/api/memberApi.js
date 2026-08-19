import api from "./axios";



// ===============================
// CREATE MEMBER
// ===============================

export const createMember = async(data)=>{

    const response = await api.post(
        "/members",
        data
    );

    return response.data;

};




// ===============================
// GET ALL MEMBERS
// ===============================

export const getMembers = async()=>{

    const response = await api.get(
        "/members"
    );

    return response.data;

};




// ===============================
// GET MEMBERS BY FAMILY
// ===============================

export const getFamilyMembers = async(familyId)=>{

    const response = await api.get(
        `/members/family/${familyId}`
    );

    return response.data;

};




// ===============================
// GET SINGLE MEMBER
// ===============================

export const getMember = async(id)=>{

    const response = await api.get(
        `/members/${id}`
    );

    return response.data;

};




// ===============================
// UPDATE MEMBER
// ===============================

export const updateMember = async(id,data)=>{

    const response = await api.put(
        `/members/${id}`,
        data
    );

    return response.data;

};




// ===============================
// DELETE MEMBER
// ===============================

export const deleteMember = async(id)=>{

    const response = await api.delete(
        `/members/${id}`
    );

    return response.data;

};




// ===============================
// ADD SPOUSE
// ===============================

export const addSpouse = async(memberId,data)=>{

    const response = await api.put(
        `/members/${memberId}/spouse`,
        data
    );

    return response.data;

};




// ===============================
// GET CHILDREN
// ===============================

export const getChildren = async(id)=>{

    const response = await api.get(
        `/members/${id}/children`
    );

    return response.data;

};




// ===============================
// GET SIBLINGS
// ===============================

export const getSiblings = async(id)=>{

    const response = await api.get(
        `/members/${id}/siblings`
    );

    return response.data;

};




// ===============================
// GET SPOUSE
// ===============================

export const getSpouse = async(id)=>{

    const response = await api.get(
        `/members/${id}/spouse`
    );

    return response.data;

};




// ===============================
// GIVE PERMISSION
// ===============================

export const givePermission = async(id,data)=>{

    const response = await api.post(
        `/members/${id}/permission`,
        data
    );

    return response.data;

};
export const getMyBranchMembers = async () => {
    const response = await api.get("/members/subroot/branch");
    return response.data;
};

export const getMyBranchMember = async (id) => {
    const response = await api.get(`/members/subroot/branch/${id}`);
    return response.data;
};

export const getMyChildren = async () => {
    const response = await api.get("/members/subroot/children");
    return response.data;
};

export const getMyAncestors = async () => {
    const response = await api.get("/members/subroot/ancestors");
    return response.data;
};

export const getMyDescendants = async () => {
    const response = await api.get("/members/subroot/descendants");
    return response.data;
};

export const updateMyBranchMember = async (id, data) => {
    const response = await api.put(
        `/members/subroot/branch/${id}`,
        data
    );

    return response.data;
};

export const deleteMyBranchMember = async (id) => {
    const response = await api.delete(
        `/members/subroot/branch/${id}`
    );

    return response.data;
};

export const giveBranchPermission = async (id, data) => {
    const response = await api.post(
        `/members/subroot/children/${id}/permission`,
        data
    );

    return response.data;
};


export const createMemberByAdmin = (data) => {

    return api.post(
        "/members/add",
        data
    );

};