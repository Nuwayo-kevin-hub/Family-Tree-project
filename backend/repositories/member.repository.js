const db = require("../config/database");
const bcrypt=require("bcrypt");

// GET ALL MEMBERS
const getMembers = async () => {

    const result = await db.query(
        "SELECT * FROM members ORDER BY id ASC"
    );

    return result.rows;

};




// GET ONE MEMBER
const getMember = async(id)=>{

    const result = await db.query(

        "SELECT * FROM members WHERE id=$1",

        [id]

    );

    return result.rows[0] || null;

};
// GIVE PERMISSION + CREATE USER ACCOUNT

const givePermission = async (memberId, data) => {

    const username = data.username;
    const password = data.password;


    // Validate credentials
    if (!username || !password) {

        throw new Error(
            "Username and password are required"
        );

    }


    // Get member
    const memberResult = await db.query(
        `
        SELECT
            id,
            role,
            has_account
        FROM members
        WHERE id=$1
        `,
        [memberId]
    );


    if (memberResult.rows.length === 0) {

        throw new Error("Member not found");

    }


    const member = memberResult.rows[0];


    // Already has account
    if (member.has_account) {

        throw new Error(
            "This member already has an account"
        );

    }


    // Check username
    const usernameResult = await db.query(
        `
        SELECT id
        FROM users
        WHERE username=$1
        `,
        [username]
    );


    if (usernameResult.rows.length > 0) {

        throw new Error(
            "Username already exists"
        );

    }


    // Hash password
    const hashedPassword = await bcrypt.hash(
        password,
        10
    );


    // Create user account
    await db.query(
        `
        INSERT INTO users
        (
            member_id,
            username,
            password
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        `,
        [
            memberId,
            username,
            hashedPassword
        ]
    );


    // Change member permission
    await db.query(
        `
        UPDATE members
        SET
            role='SUB_ROOT_ADMIN',
            has_account=true,
            account_status='ACTIVE'
        WHERE id=$1
        `,
        [memberId]
    );


    return {

        member_id: memberId,

        username: username,

        role: "SUB_ROOT_ADMIN",

        message:
            "Permission granted and account created successfully"

    };

};




// CREATE MEMBER
const createMember = async(data)=>{

    return new Promise((resolve,reject)=>{


        const sql = `

        INSERT INTO members
        (
            family_id,
            first_name,
            middle_name,
            last_name,
            gender,
            date_of_birth,
            phone,
            email,
            national_id,
            father_id,
            mother_id,
            spouse_id,
            role,
            is_alive,
            has_account,
            account_status
        )

        VALUES
        (
            $1,$2,$3,$4,$5,$6,$7,$8,
            $9,$10,$11,$12,$13,$14,$15,$16
        )

        RETURNING id

        `;


        db.query(

            sql,

            [

                data.family_id,
                data.first_name,
                data.middle_name || null,
                data.last_name || null,
                data.gender,
                data.date_of_birth || null,
                data.phone || null,
                data.email || null,
                data.national_id || null,
                data.father_id || null,
                data.mother_id || null,
                data.spouse_id || null,
                data.role || "MEMBER",
                data.is_alive ?? true,
                data.has_account ?? false,
                data.account_status || "NO_ACCOUNT"

            ],


            (err,result)=>{

                if(err)
                    return reject(err);


                resolve({

                    id: result.rows[0].id

                });


            }


        );


    });


};





// ADD SPOUSE

const addSpouse = async(memberId, spouseId)=>{


    await db.query(

        `

        UPDATE members

        SET spouse_id=$1

        WHERE id=$2

        `,

        [

            spouseId,
            memberId

        ]

    );


    return true;

};






// UPDATE MEMBER

const updateMember = async(id,data)=>{


    await db.query(

    `

    UPDATE members SET


    first_name=$1,
    middle_name=$2,
    last_name=$3,
    gender=$4,
    date_of_birth=$5,
    phone=$6,
    email=$7,
    photo=$8,
    national_id=$9,
    role=$10,
    is_alive=$11


    WHERE id=$12


    `,


    [

        data.first_name,
        data.middle_name || null,
        data.last_name || null,
        data.gender,
        data.date_of_birth || null,
        data.phone || null,
        data.email || null,
        data.photo || null,
        data.national_id || null,
        data.role || "MEMBER",
        data.is_alive ?? true,
        id

    ]


    );


    return {

        message:"Member updated successfully"

    };


};






const deleteMember = async (id) => {

    await db.query(
        `
        UPDATE members
        SET is_deleted=true
        WHERE id=$1
        `,
        [id]
    );

    return {
        message: "Member deleted successfully"
    };
};








// GET CHILDREN

const getChildren = async(memberId)=>{


    const result = await db.query(

        `

        SELECT *

        FROM members

        WHERE father_id=$1
        OR mother_id=$1

        `,

        [memberId]

    );


    return result.rows;


};









// GET SIBLINGS

const getSiblings = async(memberId)=>{


    const parent = await db.query(

        `

        SELECT father_id,mother_id

        FROM members

        WHERE id=$1

        `,

        [memberId]

    );


    if(parent.rows.length===0)
        return [];



    const {
        father_id,
        mother_id

    } = parent.rows[0];



    const result = await db.query(

        `

        SELECT *

        FROM members

        WHERE id<>$1

        AND

        (
            father_id=$2
            OR
            mother_id=$3
        )

        `,

        [

            memberId,
            father_id,
            mother_id

        ]

    );


    return result.rows;


};









// GET SPOUSE

const getSpouse = async(memberId)=>{


    const result = await db.query(

        `

        SELECT s.*

        FROM members m

        JOIN members s

        ON m.spouse_id=s.id


        WHERE m.id=$1


        `,

        [memberId]

    );


    return result.rows[0] || null;


};







const getMembersByFamily = async (familyId) => {

    const result = await db.query(
        `
        SELECT *
        FROM members
        WHERE family_id=$1
        AND is_deleted=false
        ORDER BY id ASC
        `,
        [familyId]
    );

    return result.rows;
};



// ============================================================
// SUB ROOT ADMIN FUNCTIONS
// ============================================================


// ------------------------------------------------------------
// GET SUB ROOT ADMIN MEMBER
// ------------------------------------------------------------
// Finds the member record connected to the logged-in user.
//
// users.member_id -> members.id
// ------------------------------------------------------------

const getSubRootAdminMember = async (userId) => {

    const result = await db.query(
        `
        SELECT
            m.*
        FROM users u
        JOIN members m
            ON m.id = u.member_id
        WHERE u.id = $1
        AND m.role = 'SUB_ROOT_ADMIN'
        AND m.is_deleted = false
        `,
        [userId]
    );

    return result.rows[0] || null;
};



// ------------------------------------------------------------
// GET ALL MEMBERS IN SUB ROOT ADMIN BRANCH
// ------------------------------------------------------------
// The branch starts from the Sub Root Admin and follows:
//
// Sub Root Admin
//       ↓
//     Child
//       ↓
//   Grandchild
//       ↓
//   Grandchild...
//
// This allows the Sub Root Admin to view their descendants.
// ------------------------------------------------------------

const getMyBranchMembers = async (userId) => {

    const result = await db.query(
        `
        WITH RECURSIVE branch AS (

            -- Start from Sub Root Admin
            SELECT
                m.*
            FROM users u
            JOIN members m
                ON m.id = u.member_id
            WHERE u.id = $1
            AND m.role = 'SUB_ROOT_ADMIN'
            AND m.is_deleted = false


            UNION ALL


            -- Find children / descendants
            SELECT
                child.*
            FROM members child
            JOIN branch parent
                ON child.father_id = parent.id
                OR child.mother_id = parent.id
            WHERE child.is_deleted = false

        )

        SELECT DISTINCT *
        FROM branch
        ORDER BY id ASC
        `,
        [userId]
    );

    return result.rows;
};



// ------------------------------------------------------------
// GET ONE MEMBER FROM SUB ROOT ADMIN BRANCH
// ------------------------------------------------------------

const getMyBranchMember = async (userId, memberId) => {

    const result = await db.query(
        `
        WITH RECURSIVE branch AS (

            SELECT
                m.id
            FROM users u
            JOIN members m
                ON m.id = u.member_id
            WHERE u.id = $1
            AND m.role = 'SUB_ROOT_ADMIN'
            AND m.is_deleted = false


            UNION ALL


            SELECT
                child.id
            FROM members child
            JOIN branch parent
                ON child.father_id = parent.id
                OR child.mother_id = parent.id
            WHERE child.is_deleted = false

        )

        SELECT m.*
        FROM members m
        JOIN branch b
            ON b.id = m.id
        WHERE m.id = $2
        AND m.is_deleted = false
        `,
        [userId, memberId]
    );

    return result.rows[0] || null;
};



// ------------------------------------------------------------
// UPDATE MEMBER IN SUB ROOT ADMIN BRANCH
// ------------------------------------------------------------
// IMPORTANT:
//
// This function does NOT allow the Sub Root Admin to change:
//
// - ROOT_ADMIN
// - another SUB_ROOT_ADMIN
//
// It only updates normal members in their branch.
// ------------------------------------------------------------

const updateMyBranchMember = async (
    userId,
    memberId,
    data
) => {

    const result = await db.query(
        `
        WITH RECURSIVE branch AS (

            SELECT
                m.id
            FROM users u
            JOIN members m
                ON m.id = u.member_id
            WHERE u.id = $1
            AND m.role = 'SUB_ROOT_ADMIN'
            AND m.is_deleted = false


            UNION ALL


            SELECT
                child.id
            FROM members child
            JOIN branch parent
                ON child.father_id = parent.id
                OR child.mother_id = parent.id
            WHERE child.is_deleted = false

        )

        UPDATE members m
        SET
            first_name = $3,
            middle_name = $4,
            last_name = $5,
            gender = $6,
            date_of_birth = $7,
            phone = $8,
            email = $9,
            photo = $10,
            national_id = $11,
            is_alive = $12

        FROM branch b

        WHERE m.id = b.id
        AND m.id = $2
        AND m.role = 'MEMBER'

        RETURNING m.*
        `,
        [
            userId,
            memberId,
            data.first_name,
            data.middle_name || null,
            data.last_name || null,
            data.gender,
            data.date_of_birth || null,
            data.phone || null,
            data.email || null,
            data.photo || null,
            data.national_id || null,
            data.is_alive ?? true
        ]
    );

    if (result.rows.length === 0) {

        throw new Error(
            "Member is not in your branch or cannot be modified"
        );

    }

    return result.rows[0];
};



// ------------------------------------------------------------
// DELETE MEMBER FROM SUB ROOT ADMIN BRANCH
// ------------------------------------------------------------
// Soft delete only.
//
// Sub Root Admin cannot delete:
// - ROOT_ADMIN
// - SUB_ROOT_ADMIN
// - members outside their branch
// ------------------------------------------------------------

const deleteMyBranchMember = async (
    userId,
    memberId
) => {

    const result = await db.query(
        `
        WITH RECURSIVE branch AS (

            SELECT
                m.id
            FROM users u
            JOIN members m
                ON m.id = u.member_id
            WHERE u.id = $1
            AND m.role = 'SUB_ROOT_ADMIN'
            AND m.is_deleted = false


            UNION ALL


            SELECT
                child.id
            FROM members child
            JOIN branch parent
                ON child.father_id = parent.id
                OR child.mother_id = parent.id
            WHERE child.is_deleted = false

        )

        UPDATE members m
        SET
            is_deleted = true

        FROM branch b

        WHERE m.id = b.id
        AND m.id = $2
        AND m.role = 'MEMBER'

        RETURNING m.id
        `,
        [userId, memberId]
    );

    if (result.rows.length === 0) {

        throw new Error(
            "Member is not in your branch or cannot be deleted"
        );

    }

    return {
        member_id: result.rows[0].id,
        message: "Member deleted successfully"
    };
};



// ------------------------------------------------------------
// GET DIRECT CHILDREN OF SUB ROOT ADMIN
// ------------------------------------------------------------
// These are the people to whom the Sub Root Admin can give
// Branch Admin permission.
//
// IMPORTANT:
// Permission is NOT given to arbitrary descendants.
// ------------------------------------------------------------

const getMyChildren = async (userId) => {

    const result = await db.query(
        `
        SELECT child.*

        FROM users u

        JOIN members admin
            ON admin.id = u.member_id

        JOIN members child
            ON child.father_id = admin.id
            OR child.mother_id = admin.id

        WHERE u.id = $1

        AND admin.role = 'SUB_ROOT_ADMIN'

        AND child.role = 'MEMBER'

        AND child.is_deleted = false

        ORDER BY child.id ASC
        `,
        [userId]
    );

    return result.rows;
};



// ------------------------------------------------------------
// GIVE BRANCH ADMIN PERMISSION
// ------------------------------------------------------------
// Sub Root Admin can give permission only to THEIR CHILD.
//
// The new role is BRANCH_ADMIN.
//
// This does NOT affect the Root Admin's existing
// givePermission() function.
// ------------------------------------------------------------

const giveBranchPermission = async (
    userId,
    memberId,
    data
) => {

    const username = data.username;
    const password = data.password;


    if (!username || !password) {

        throw new Error(
            "Username and password are required"
        );

    }


    // --------------------------------------------------------
    // Check that member is a direct child of this Sub Root
    // --------------------------------------------------------

    const memberResult = await db.query(
        `
        SELECT
            child.id,
            child.role,
            child.has_account,
            child.father_id,
            child.mother_id

        FROM users u

        JOIN members admin
            ON admin.id = u.member_id

        JOIN members child
            ON child.father_id = admin.id
            OR child.mother_id = admin.id

        WHERE u.id = $1

        AND admin.role = 'SUB_ROOT_ADMIN'

        AND child.id = $2

        AND child.is_deleted = false
        `,
        [
            userId,
            memberId
        ]
    );


    if (memberResult.rows.length === 0) {

        throw new Error(
            "This member is not your direct child"
        );

    }


    const member = memberResult.rows[0];


    if (member.role !== "MEMBER") {

        throw new Error(
            "Only normal members can receive Branch Admin permission"
        );

    }


    if (member.has_account) {

        throw new Error(
            "This member already has an account"
        );

    }


    // --------------------------------------------------------
    // Check username
    // --------------------------------------------------------

    const usernameResult = await db.query(
        `
        SELECT id
        FROM users
        WHERE username = $1
        `,
        [username]
    );


    if (usernameResult.rows.length > 0) {

        throw new Error(
            "Username already exists"
        );

    }


    // --------------------------------------------------------
    // Hash password
    // --------------------------------------------------------

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );


    // --------------------------------------------------------
    // Create account
    // --------------------------------------------------------

    await db.query(
        `
        INSERT INTO users
        (
            member_id,
            username,
            password
        )
        VALUES
        (
            $1,
            $2,
            $3
        )
        `,
        [
            memberId,
            username,
            hashedPassword
        ]
    );


    // --------------------------------------------------------
    // Change role
    // --------------------------------------------------------

    await db.query(
        `
        UPDATE members

        SET
            role = 'BRANCH_ADMIN',
            has_account = true,
            account_status = 'ACTIVE'

        WHERE id = $1
        `,
        [memberId]
    );


    return {

        member_id: memberId,

        username,

        role: "BRANCH_ADMIN",

        message:
            "Branch Admin permission granted successfully"

    };
};



// ------------------------------------------------------------
// GET ANCESTORS FOR SUB ROOT ADMIN
// ------------------------------------------------------------
// Returns parents, grandparents, etc.
// ------------------------------------------------------------

const getMyAncestors = async (
    userId,
    memberId
) => {

    const result = await db.query(
        `
        WITH RECURSIVE ancestors AS (

            SELECT
                m.*

            FROM members m

            JOIN users u
                ON u.member_id = m.id

            WHERE u.id = $1


            UNION ALL


            SELECT
                parent.*

            FROM members parent

            JOIN ancestors child
                ON parent.id = child.father_id
                OR parent.id = child.mother_id

            WHERE parent.is_deleted = false

        )

        SELECT DISTINCT *
        FROM ancestors
        WHERE id <> (
            SELECT member_id
            FROM users
            WHERE id = $1
        )

        ORDER BY id ASC
        `,
        [userId]
    );

    return result.rows;
};



// ------------------------------------------------------------
// GET DESCENDANTS FOR SUB ROOT ADMIN
// ------------------------------------------------------------

const getMyDescendants = async (userId) => {

    const result = await db.query(
        `
        WITH RECURSIVE descendants AS (

            SELECT
                m.*

            FROM users u

            JOIN members m
                ON m.id = u.member_id

            WHERE u.id = $1


            UNION ALL


            SELECT
                child.*

            FROM members child

            JOIN descendants parent
                ON child.father_id = parent.id
                OR child.mother_id = parent.id

            WHERE child.is_deleted = false

        )

        SELECT DISTINCT *
        FROM descendants

        WHERE id <> (
            SELECT member_id
            FROM users
            WHERE id = $1
        )

        ORDER BY id ASC
        `,
        [userId]
    );

    return result.rows;
};

// ============================================================
// CREATE MEMBER BY ROOT ADMIN OR SUB ROOT ADMIN
// ============================================================
const createMemberByAdmin = async ({ data, adminUserId }) => {

    // ========================================================
    // 1. FIND LOGGED-IN ADMIN
    // ========================================================

    const adminResult = await db.query(
        `
        SELECT
            u.id AS user_id,

            m.id AS member_id,
            m.family_id,
            m.first_name,
            m.last_name,
            m.gender,
            m.role,
            m.father_id,
            m.mother_id,
            m.spouse_id

        FROM users u

        INNER JOIN members m
            ON m.id = u.member_id

        WHERE u.id = $1
        AND m.is_deleted = false
        `,
        [adminUserId]
    );


    if (adminResult.rows.length === 0) {

        throw new Error(
            "Admin member not found."
        );

    }


    const admin = adminResult.rows[0];


    console.log("ADMIN FROM DATABASE:", admin);


    // ========================================================
    // 2. CHECK ADMIN ROLE
    // ========================================================

    if (
        admin.role !== "ROOT_ADMIN" &&
        admin.role !== "SUB_ROOT_ADMIN"
    ) {

        throw new Error(
            "Only Root Admin or Sub Root Admin can add family members."
        );

    }


    // ========================================================
    // 3. CHECK FAMILY
    // ========================================================

    if (
        Number(data.family_id) !==
        Number(admin.family_id)
    ) {

        throw new Error(
            "You cannot add a member to another family."
        );

    }


    // ========================================================
    // 4. NORMALIZE ADMIN GENDER
    // ========================================================

    const adminGender =
        String(admin.gender || "")
            .trim()
            .toUpperCase();


    console.log(
        "ADMIN GENDER:",
        adminGender
    );


    // ========================================================
    // 5. PREPARE RELATIONSHIP IDS
    // ========================================================

    let fatherId = null;
    let motherId = null;
    let spouseId = null;


    // ========================================================
    // 6. CHILD
    // ========================================================

   if (data.relationship === "CHILD") {

    if (adminGender === "MALE") {

        fatherId = admin.member_id;

        if (admin.spouse_id) {
            motherId = Number(admin.spouse_id);
        }

    }

    else if (adminGender === "FEMALE") {

        motherId = admin.member_id;

        if (admin.spouse_id) {
            fatherId = Number(admin.spouse_id);
        }

    }

    else {

        throw new Error(
            `Admin gender is invalid: "${admin.gender}".`
        );

    }

    // VERY IMPORTANT:
    // Child has no spouse yet
    spouseId = null;
}

    // ========================================================
    // 7. SIBLING
    // ========================================================

    else if (data.relationship === "SIBLING") {

        /*
         * The new sibling receives the same parents
         * as the logged-in admin.
         */

        fatherId =
            admin.father_id || null;

        motherId =
            admin.mother_id || null;

    }


    // ========================================================
    // 8. PARENT
    // ========================================================

    else if (data.relationship === "PARENT") {

        /*
         * A parent does not receive a parent ID.
         *
         * After creating the parent, we connect the new
         * parent back to the logged-in admin.
         */

        fatherId = null;

        motherId = null;

        spouseId = null;

    }


    // ========================================================
    // 9. SPOUSE
    // ========================================================

    else if (data.relationship === "SPOUSE") {

        /*
         * New member becomes spouse of logged-in admin.
         */

        spouseId =
            admin.member_id;

    }


    // ========================================================
    // 10. OTHER
    // ========================================================

    else if (data.relationship === "OTHER") {

        fatherId = null;

        motherId = null;

        spouseId = null;

    }


    // ========================================================
    // 11. INVALID RELATIONSHIP
    // ========================================================

    else {

        throw new Error(
            "Invalid relationship. " +
            "Use CHILD, SIBLING, PARENT, SPOUSE or OTHER."
        );

    }


    // ========================================================
    // 12. INSERT NEW MEMBER
    // ========================================================

    const result = await db.query(
        `
        INSERT INTO members
        (
            family_id,

            first_name,
            middle_name,
            last_name,

            gender,
            date_of_birth,

            phone,
            email,
            national_id,

            father_id,
            mother_id,
            spouse_id,

            role,

            is_alive,
            has_account,
            account_status,

            is_deleted
        )

        VALUES
        (
            $1,

            $2,
            $3,
            $4,

            $5,
            $6,

            $7,
            $8,
            $9,

            $10,
            $11,
            $12,

            'MEMBER',

            TRUE,
            FALSE,
            'NO_ACCOUNT',

            FALSE
        )

        RETURNING *
        `,
        [

            admin.family_id,

            data.first_name,

            data.middle_name || null,

            data.last_name || null,

            String(data.gender || "")
                .trim()
                .toUpperCase(),

            data.date_of_birth || null,

            data.phone || null,

            data.email || null,

            data.national_id || null,

            fatherId,

            motherId,

            spouseId

        ]
    );


    const newMember =
        result.rows[0];


    // ========================================================
    // 13. SPOUSE CONNECTION
    // ========================================================

    if (data.relationship === "SPOUSE") {

        await db.query(
            `
            UPDATE members

            SET spouse_id = $1

            WHERE id = $2
            `,
            [
                newMember.id,
                admin.member_id
            ]
        );

    }


    // ========================================================
    // 14. PARENT CONNECTION
    // ========================================================

    if (data.relationship === "PARENT") {

        const parentGender =
            String(data.gender || "")
                .trim()
                .toUpperCase();


        // ----------------------------------------------------
        // NEW FATHER
        // ----------------------------------------------------

        if (parentGender === "MALE") {

            if (admin.father_id) {

                // Remove newly-created orphan parent
                await db.query(
                    `
                    DELETE FROM members
                    WHERE id = $1
                    `,
                    [newMember.id]
                );

                throw new Error(
                    "This admin already has a father."
                );

            }


            await db.query(
                `
                UPDATE members

                SET father_id = $1

                WHERE id = $2
                `,
                [
                    newMember.id,
                    admin.member_id
                ]
            );

        }


        // ----------------------------------------------------
        // NEW MOTHER
        // ----------------------------------------------------

        else if (parentGender === "FEMALE") {

            if (admin.mother_id) {

                await db.query(
                    `
                    DELETE FROM members
                    WHERE id = $1
                    `,
                    [newMember.id]
                );

                throw new Error(
                    "This admin already has a mother."
                );

            }


            await db.query(
                `
                UPDATE members

                SET mother_id = $1

                WHERE id = $2
                `,
                [
                    newMember.id,
                    admin.member_id
                ]
            );

        }


        else {

            await db.query(
                `
                DELETE FROM members
                WHERE id = $1
                `,
                [newMember.id]
            );

            throw new Error(
                "Parent gender must be MALE or FEMALE."
            );

        }

    }


    // ========================================================
    // 15. RETURN
    // ========================================================

    return newMember;
};






module.exports={


    getMembers,

    getMember,

    createMember,

    addSpouse,

    updateMember,
    createMemberByAdmin,
    deleteMember,
    givePermission,

    getChildren,

    getSiblings,

    getSpouse,

    getMembersByFamily,

        // SUB ROOT ADMIN FUNCTIONS
    // ========================================================

    getSubRootAdminMember,

    getMyBranchMembers,

    getMyBranchMember,

    updateMyBranchMember,

    deleteMyBranchMember,

    getMyChildren,

    giveBranchPermission,

    getMyAncestors,

    getMyDescendants


};