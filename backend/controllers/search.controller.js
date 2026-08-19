const searchService = require("../services/search.service");


const searchFamily = async (req,res)=>{

    try{

        const result = await searchService.searchFamily(req.query);

        res.status(200).json(result);


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



const createRequest = async(req,res)=>{

    try{

        const result = await searchService.createRequest(req.body);

        res.status(201).json(result);


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



const getRequests = async(req,res)=>{

    try{

        const result = await searchService.getRequests();

        res.json(result);


    }catch(error){

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const getMatches = async(req,res)=>{

    try{

        const result =
        await searchService.getMatches(
            req.params.requestId
        );


        return res.status(200).json(result);


    }catch(error){

        return res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



const rejectRequest = async(req,res)=>{

    try{

        if(req.user.role !== "ROOT_ADMIN"){

            return res.status(403).json({
                success:false,
                message:"Access denied"
            });

        }

        const result = await searchService.rejectRequest(
            req.params.id,
            req.user.id
        );

        return res.status(200).json(result);

    }
    catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};

const getMyRequests = async (req, res) => {

    try {

        if (req.user.role !== "ROOT_ADMIN") {

            return res.status(403).json({
                success: false,
                message: "Access denied"
            });

        }

        const result = await searchService.getMyRequests(req.user.id);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
const getRequestDetails = async(req,res)=>{

try{

const result =
await searchService.getRequestDetails(
req.params.requestId
);

res.json(result);

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};

const approveRequest = async(req,res)=>{

    try{

        if(req.user.role !== "ROOT_ADMIN"){

            return res.status(403).json({
                success:false,
                message:"Access denied"
            });

        }

        const result = await searchService.approveRequest(
            req.params.id,
            req.user.id
        );

        return res.status(200).json(result);

    }
    catch(error){

        return res.status(500).json({
            success:false,
            message:error.message
        });

    }

};





module.exports = {

    searchFamily,
    createRequest,
    getRequests,
    approveRequest,
    rejectRequest,
    getMatches,
    getMyRequests,
    getRequestDetails

};