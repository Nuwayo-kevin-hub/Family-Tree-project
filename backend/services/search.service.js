const searchRepository = require("../repositories/search.repository");


const searchFamily = async(data)=>{
    return await searchRepository.searchFamily(data);
};


const createRequest = async(data)=>{
    return await searchRepository.createRequest(data);
};


const getRequests = async()=>{
    return await searchRepository.getRequests();
};

const getMatches = async(requestId)=>{

    return await searchRepository.getMatches(requestId);

};



const rejectRequest = async(requestId, rootAdminId)=>{

    return await searchRepository.rejectRequest(
        requestId,
        rootAdminId
    );

};


const getMyRequests = async(rootAdminId)=>{

    return await searchRepository.getMyRequests(rootAdminId);

};

const getRequestDetails = async(requestId)=>{

    return await searchRepository.getRequestDetails(requestId);

};

const approveRequest = async(requestId, rootAdminId)=>{

    return await searchRepository.approveRequest(
        requestId,
        rootAdminId
    );

};


module.exports = {

    searchFamily,
    createRequest,
    getRequests,
    rejectRequest,
    getMyRequests,
    getMatches,
    getRequestDetails,
    approveRequest

};