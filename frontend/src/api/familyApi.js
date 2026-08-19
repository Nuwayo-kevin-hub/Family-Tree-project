import axios from "./axios";



// ==============================
// REGISTER FAMILY

export const registerFamily = async(data)=>{

    const response = await axios.post(

        "/family/register",

        data

    );


    return response.data;

};



// ==============================
// GET ALL FAMILIES
// ==============================

export const getFamilies = async () => {

    const response = await axios.get(
        "/families"
    );

    return response.data;

};



// ==============================
// GET FAMILY BY ID
// ==============================

export const getFamilyById = async (id) => {

    const response = await axios.get(
        `/families/${id}`
    );

    return response.data;

};



// ==============================
// UPDATE FAMILY
// ==============================

export const updateFamily = async (id, data) => {

    const response = await axios.put(
        `/families/${id}`,
        data
    );

    return response.data;

};



// ==============================
// DELETE FAMILY
// ==============================

export const deleteFamily = async (id) => {

    const response = await axios.delete(
        `/families/${id}`
    );

    return response.data;

};



// ==============================
// SEARCH FAMILY
// ==============================

export const searchFamily = async (keyword) => {

    const response = await axios.get(
        `/families/search/${keyword}`
    );

    return response.data;

};



// ==============================
// GET FAMILY TREE
// ==============================

export const getFamilyTree = async (familyId) => {

    const response = await axios.get(
        `/tree/${familyId}`
    );

    return response.data;

};



// ==============================
// GET ANCESTORS
// ==============================

export const getAncestors = async (memberId) => {

    const response = await axios.get(
        `/tree/ancestors/${memberId}`
    );

    return response.data;

};



// ==============================
// GET DESCENDANTS
// ==============================

export const getDescendants = async (memberId) => {

    const response = await axios.get(
        `/tree/descendants/${memberId}`
    );

    return response.data;

};