const db = require("../config/database");


const checkFamilyPermission = async(req,res,next)=>{


    try{


        const userId = req.user.id;



        const sql = `

        SELECT 
        m.id,
        m.family_id,
        m.role

        FROM members m

        WHERE m.id=?

        `;



        db.query(
            sql,
            [userId],
            (err,result)=>{


                if(err)
                return res.status(500).json(err);



                if(result.length===0){


                    return res.status(404).json({

                        message:"Member not found"

                    });

                }



                req.member = result[0];


                next();


            }

        );


    }
    catch(error){

        res.status(500).json(error);

    }


};



module.exports = checkFamilyPermission;