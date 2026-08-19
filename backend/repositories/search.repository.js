const db = require("../config/database");




// SEARCH FAMILY

const searchFamily = async(data)=>{


    const {
        name,
        phone,
        email,
        family_id

    } = data;



    let sql = `

    SELECT

    id,
    family_id,
    first_name,
    middle_name,
    last_name,
    gender,
    date_of_birth,
    phone,
    email,
    role

    FROM members

    WHERE 1=1

    `;


    let params=[];



    if(name){

        params.push(
            `%${name}%`,
            `%${name}%`,
            `%${name}%`
        );


        sql += `

        AND (

        first_name ILIKE $${params.length-2}

        OR middle_name ILIKE $${params.length-1}

        OR last_name ILIKE $${params.length}

        )

        `;

    }




    if(phone){

        params.push(`%${phone}%`);

        sql +=`

        AND phone ILIKE $${params.length}

        `;

    }





    if(email){

        params.push(`%${email}%`);

        sql +=`

        AND email ILIKE $${params.length}

        `;

    }





    if(family_id){

        params.push(family_id);

        sql +=`

        AND family_id=$${params.length}

        `;

    }





    const result = await db.query(
        sql,
        params
    );


    return result.rows;


};









// CREATE LOST FAMILY REQUEST


const createRequest = async(data)=>{


    const result = await db.query(

`

INSERT INTO family_requests

(

full_name,
gender,
phone,
email,

family_name,

father_name,
mother_name,

sibling_name,
sibling_gender,
sibling_description,

birth_place,

remembered_name,

district,
sector,
village,

description,
photo

)

VALUES

(

$1,$2,$3,$4,$5,$6,$7,$8,$9,
$10,$11,$12,$13,$14,$15,$16,$17

)

RETURNING id

`,


[

data.full_name,
data.gender,
data.phone,
data.email,

data.family_name,

data.father_name,
data.mother_name,

data.sibling_name,
data.sibling_gender,
data.sibling_description,

data.birth_place,

data.remembered_name,

data.district,
data.sector,
data.village,

data.description,
data.photo

]


);



return {

message:"Request submitted successfully",

request_id:result.rows[0].id

};



};









// GET ALL REQUESTS


const getRequests = async()=>{


const result = await db.query(

`

SELECT *

FROM family_requests

ORDER BY created_at DESC

`

);


return result.rows;


};









// GET MY REQUESTS


const getMyRequests = async(rootAdminId)=>{


const result = await db.query(

`

SELECT


n.id AS notification_id,

n.status,

n.created_at,


fr.id AS request_id,

fr.full_name,

fr.gender,

fr.phone,

fr.email,

fr.family_name,

fr.description



FROM notifications n


JOIN family_requests fr

ON fr.id=n.request_id


WHERE n.root_admin_id=$1


ORDER BY n.created_at DESC


`,

[rootAdminId]


);



return result.rows;


};









// GET MATCHES


const getMatches = async(requestId)=>{


const result = await db.query(

`

SELECT


m.id,

m.first_name,

m.middle_name,

m.last_name,

m.gender,

m.date_of_birth,

m.family_id,

m.role,



(

CASE

WHEN m.first_name ILIKE '%'||fr.father_name||'%'

THEN 20 ELSE 0 END


+

CASE

WHEN m.first_name ILIKE '%'||fr.mother_name||'%'

THEN 20 ELSE 0 END



+

CASE

WHEN m.first_name ILIKE '%'||fr.sibling_name||'%'

THEN 20 ELSE 0 END


+

CASE

WHEN f.family_name ILIKE '%'||fr.family_name||'%'

THEN 40 ELSE 0 END


) AS match_score



FROM members m


JOIN families f

ON f.id=m.family_id


JOIN family_requests fr

ON fr.id=$1



ORDER BY match_score DESC


`,

[requestId]


);



if(result.rows.length>0){

    await assignRequestToRootAdmin(
        requestId,
        result.rows[0].family_id
    );

}


return result.rows;


};









// ASSIGN REQUEST TO ROOT ADMIN


const assignRequestToRootAdmin = async(
requestId,
familyId
)=>{


const admin = await db.query(

`

SELECT id

FROM members

WHERE family_id=$1

AND role='ROOT_ADMIN'

LIMIT 1

`,

[familyId]

);



if(admin.rows.length===0)
return null;



const rootAdminId=admin.rows[0].id;



await db.query(

`

INSERT INTO notifications

(

request_id,
family_id,
root_admin_id

)

VALUES($1,$2,$3)

`,

[

requestId,
familyId,
rootAdminId

]


);



return rootAdminId;


};









// REQUEST DETAILS


const getRequestDetails = async(requestId)=>{


const result = await db.query(

`

SELECT *

FROM family_requests

WHERE id=$1

LIMIT 1

`,

[requestId]

);


return result.rows[0] || null;


};









// MARK VIEWED


const markAsViewed = async(
requestId,
rootAdminId
)=>{


await db.query(

`

UPDATE notifications

SET status='VIEWED'

WHERE request_id=$1

AND root_admin_id=$2


`,

[

requestId,
rootAdminId

]


);



return true;


};









// APPROVE REQUEST


const approveRequest = async(
requestId,
rootAdminId
)=>{


const client = await db.connect();


try{


await client.query("BEGIN");



await client.query(

`

UPDATE family_requests

SET

status='APPROVED',

reviewed_at=NOW()

WHERE id=$1

`,

[requestId]

);




await client.query(

`

UPDATE notifications

SET status='APPROVED'

WHERE request_id=$1

AND root_admin_id=$2

`,

[

requestId,
rootAdminId

]

);



await client.query("COMMIT");



return {

success:true,

message:"Request approved successfully"

};



}catch(error){


await client.query("ROLLBACK");

throw error;


}finally{

client.release();

}



};









// REJECT REQUEST


const rejectRequest = async(
requestId,
rootAdminId
)=>{


const client = await db.connect();


try{


await client.query("BEGIN");



await client.query(

`

UPDATE family_requests

SET

status='REJECTED',

reviewed_at=NOW()

WHERE id=$1

`,

[requestId]

);



await client.query(

`

UPDATE notifications

SET status='REJECTED'

WHERE request_id=$1

AND root_admin_id=$2


`,

[

requestId,
rootAdminId

]


);



await client.query("COMMIT");



return {

success:true,

message:"Request rejected successfully"

};


}catch(error){


await client.query("ROLLBACK");

throw error;


}finally{

client.release();

}



};









module.exports={


searchFamily,

createRequest,

getRequests,

approveRequest,

rejectRequest,

getMatches,

assignRequestToRootAdmin,

getMyRequests,

getRequestDetails,

markAsViewed


};