const db = require("../config/database");


// CREATE USER ACCOUNT

const createUser = async(data)=>{

    return new Promise((resolve,reject)=>{


        const sql = `

        INSERT INTO users

        (
            member_id,
            username,
            password
        )

        VALUES($1,$2,$3)

        RETURNING id

        `;


        db.query(

            sql,

            [
                data.member_id,
                data.username,
                data.password
            ],

            (err,result)=>{


                if(err)
                    return reject(err);



                resolve({

                    id: result.rows[0].id,
                    message:"User created successfully"

                });


            }


        );


    });

};





const getUserByUsername = async(username)=>{


    return new Promise((resolve,reject)=>{


        db.query(

            `
            SELECT *
            FROM users
            WHERE username=$1
            `,

            [username],


            (err,result)=>{


                if(err)
                    return reject(err);


                resolve(result.rows[0] || null);


            }


        );


    });


};





const getUserById = async(id)=>{


    return new Promise((resolve,reject)=>{


        db.query(

            `
            SELECT *
            FROM users
            WHERE id=$1
            `,

            [id],


            (err,result)=>{


                if(err)
                    return reject(err);


                resolve(result.rows[0] || null);


            }


        );


    });


};



module.exports={

createUser,
getUserByUsername,
getUserById

};