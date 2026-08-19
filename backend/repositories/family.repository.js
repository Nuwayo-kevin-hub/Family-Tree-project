const pool = require("../config/database");



// GET ALL FAMILIES

const getFamilies = async()=>{


    const result = await pool.query(

        `

        SELECT *

        FROM families

        ORDER BY created_at DESC

        `

    );


    return result.rows;


};






// GET ONE FAMILY

const getFamily = async(id)=>{


    const result = await pool.query(

        `

        SELECT *

        FROM families

        WHERE id=$1

        `,


        [id]

    );



    return result.rows[0] || null;


};








//create family 

const createFamily = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO families
        (
            family_name,
            family_origin,
            family_description,
            created_by,
            status,
            created_at
        )
        VALUES ($1, $2, $3, $4, 'ACTIVE', NOW())
        RETURNING id
        `,
        [
            data.family_name,
            data.family_origin || null,
            data.family_description || null,
            data.created_by || null
        ]
    );

    return {
        id: result.rows[0].id,
        message: "Family created successfully"
    };
};









// UPDATE FAMILY


const updateFamily = async(id,data)=>{


    await pool.query(

        `

        UPDATE families

        SET


        family_name=$1,

        family_origin=$2,

        family_description=$3


        WHERE id=$4


        `,


        [

            data.family_name,

            data.family_origin || null,

            data.family_description || null,

            id

        ]

    );



    return {


        message:"Family updated successfully"


    };


};









// DELETE FAMILY


const deleteFamily = async(id)=>{


    await pool.query(

        `

        DELETE FROM families

        WHERE id=$1


        `,


        [id]

    );



    return {


        message:"Family deleted successfully"


    };


};









// GET FAMILY MEMBERS


const getFamilyMembers = async(familyId)=>{


    const result = await pool.query(

        `

        SELECT *

        FROM members

        WHERE family_id=$1

        ORDER BY id ASC


        `,


        [familyId]

    );



    return result.rows;


};







const searchFamiliesByName = async (searchTerm) => {
    return new Promise((resolve, reject) => {
        db.query(
            `
            SELECT 
                id,
                family_name,
                family_origin,
                family_description,
                created_by,
                status,
                created_at
            FROM families
            WHERE family_name ILIKE ?
            AND status = 'ACTIVE'
            ORDER BY family_name ASC
            LIMIT 20
            `,
            [`%${searchTerm}%`],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            }
        );
    });
};


module.exports = {


    getFamilies,

    getFamily,

    createFamily,

    updateFamily,

    deleteFamily,

    getFamilyMembers,
    searchFamiliesByName


};