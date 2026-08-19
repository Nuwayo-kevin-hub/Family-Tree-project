const dashboardService = require("../services/dashboard.service");



const getDashboard = async(req,res)=>{

try{

const result =
await dashboardService.getDashboard(
req.user.family_id
);

res.status(200).json({
success:true,
data:result
});

}
catch(error){

res.status(500).json({
success:false,
message:error.message
});

}

};


module.exports = {
    getDashboard
};