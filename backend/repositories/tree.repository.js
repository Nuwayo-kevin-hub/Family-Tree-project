const db = require("../config/database");



// GET COMPLETE FAMILY TREE

const getTree = async (familyId) => {


    const result = await db.query(

        `
        SELECT *

        FROM members

        WHERE family_id=$1

        `,

        [familyId]

    );


    const members = result.rows;



    const founder = members.find(
        m => m.role === "ROOT_ADMIN"
    );



    if(!founder)
    {
        return null;
    }



    const father = members.find(
        m => m.id === founder.father_id
    );



    const mother = members.find(
        m => m.id === founder.mother_id
    );



    const spouse = members.find(
        m => m.id === founder.spouse_id
    );




    const siblings = members.filter(

        m =>

        m.id !== founder.id &&

        m.father_id === founder.father_id &&

        m.mother_id === founder.mother_id

    );




    const children = members.filter(

        m =>

        m.father_id === founder.id ||

        m.mother_id === founder.id

    );




    return {


        family_id: familyId,


        founder:{


            id: founder.id,


            name:
            `${founder.first_name} ${founder.last_name}`,


            role: founder.role,



            parents:{


                father,

                mother


            },


            spouse,


            siblings,


            children


        }


    };


};











// GET ANCESTORS

const getAncestors = async(memberId)=>{


const result = await db.query(

`

SELECT *

FROM members

WHERE id IN

(

SELECT father_id

FROM members

WHERE id=$1


UNION


SELECT mother_id

FROM members

WHERE id=$2

)

`,

[

memberId,

memberId

]


);



return result.rows;


};












// GET DESCENDANTS


const getDescendants = async(memberId)=>{


const result = await db.query(

`

SELECT *

FROM members

WHERE father_id=$1

OR mother_id=$2

`,

[

memberId,

memberId

]


);



return result.rows;


};









module.exports={


getTree,

getAncestors,

getDescendants


};