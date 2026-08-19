const dashboardRepository = require("../repositories/dashboard.repository");

const getDashboard = async(familyId)=>{

    return await dashboardRepository.getDashboard(
        familyId
    );

};

module.exports = {
    getDashboard
};