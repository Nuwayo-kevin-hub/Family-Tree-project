const pool = require("../config/database");



// CHECK IF TWO MEMBERS HAVE RELATIONSHIP

const checkRelationship = async(memberId1, memberId2)=>{


    const sql = `

    SELECT

        m1.id AS member_one,
        m2.id AS member_two,


        m1.father_id AS member_one_father,
        m1.mother_id AS member_one_mother,


        m2.father_id AS member_two_father,
        m2.mother_id AS member_two_mother,


        m1.family_id AS member_one_family,
        m2.family_id AS member_two_family


    FROM members m1


    CROSS JOIN members m2


    WHERE m1.id=$1

    AND m2.id=$2


    `;



    const result = await pool.query(

        sql,

        [
            memberId1,
            memberId2
        ]

    );



    if(result.rows.length === 0){

        return null;

    }



    const member = result.rows[0];



    let relationship = "NO_RELATIONSHIP";



    // SAME FAMILY

    if(
        member.member_one_family === 
        member.member_two_family
    ){

        relationship="SAME_FAMILY";

    }



    // SAME PARENTS (SIBLINGS)

    if(

        member.member_one_father &&
        member.member_one_father === member.member_two_father &&

        member.member_one_mother &&
        member.member_one_mother === member.member_two_mother

    ){

        relationship="SIBLINGS";

    }




    // DIRECT PARENT CHILD

    if(

        member.member_one === member.member_two_father ||

        member.member_one === member.member_two_mother ||

        member.member_two === member.member_one_father ||

        member.member_two === member.member_one_mother

    ){

        relationship="PARENT_CHILD";

    }



    return {

        member_one: memberId1,

        member_two: memberId2,

        relationship

    };


};





module.exports={

    checkRelationship

};