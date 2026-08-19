const pool = require("../config/database");



const getDashboard = async (familyId) => {

    const sql = `

    SELECT


    (SELECT COUNT(*) 
     FROM members
     WHERE family_id=$1) AS total_members,


    (SELECT COUNT(*) 
     FROM members
     WHERE family_id=$2
     AND role='SUB_ROOT_ADMIN') AS sub_root_admins,


    (SELECT COUNT(*) 
     FROM members
     WHERE family_id=$3
     AND role='MEMBER') AS members,


    (SELECT COUNT(*) 
     FROM family_requests
     WHERE status='PENDING') AS pending_requests,


    (SELECT COUNT(*) 
     FROM family_requests
     WHERE status='APPROVED') AS approved_requests,


    (SELECT COUNT(*) 
     FROM family_requests
     WHERE status='REJECTED') AS rejected_requests


    `;



    const result = await pool.query(

        sql,

        [
            familyId,
            familyId,
            familyId
        ]

    );



    return result.rows[0];


};




module.exports = {

    getDashboard

};