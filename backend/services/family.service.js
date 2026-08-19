// backend/services/family.service.js

const pool = require("../config/database");
const familyRepository = require("../repositories/family.repository");
const memberRepository = require("../repositories/member.repository");
const userRepository = require("../repositories/user.repository");
const bcrypt = require("bcrypt");

// ============================================================
// REGISTER COMPLETE FAMILY
// ============================================================

const registerFamily = async (data) => {
    // 1. CREATE FAMILY (without created_by first)
    const family = await familyRepository.createFamily({
        family_name: data.family.family_name,
        family_origin: data.family.family_origin || null,
        family_description: data.family.family_description || null,
        created_by: null
    });

    let father = null;
    let mother = null;

    // 2. CREATE FATHER
    if (data.parents?.father) {
        father = await memberRepository.createMember({
            family_id: family.id,
            first_name: data.parents.father.first_name,
            middle_name: data.parents.father.middle_name || null,
            last_name: data.parents.father.last_name,
            gender: "Male",
            date_of_birth: data.parents.father.date_of_birth,
            phone: data.parents.father.phone || null,
            email: data.parents.father.email || null,
            national_id: data.parents.father.national_id,
            role: "MEMBER",
            is_alive: data.parents.father.is_alive ?? 1
        });
    }

    // 3. CREATE MOTHER
    if (data.parents?.mother) {
        mother = await memberRepository.createMember({
            family_id: family.id,
            first_name: data.parents.mother.first_name,
            middle_name: data.parents.mother.middle_name || null,
            last_name: data.parents.mother.last_name,
            gender: "Female",
            date_of_birth: data.parents.mother.date_of_birth,
            phone: data.parents.mother.phone || null,
            email: data.parents.mother.email || null,
            national_id: data.parents.mother.national_id,
            role: "MEMBER",
            is_alive: data.parents.mother.is_alive ?? 1
        });
    }

    // 4. CREATE FOUNDER
    const founder = await memberRepository.createMember({
        family_id: family.id,
        first_name: data.founder.first_name,
        middle_name: data.founder.middle_name || null,
        last_name: data.founder.last_name,
        gender: data.founder.gender,
        date_of_birth: data.founder.date_of_birth,
        phone: data.founder.phone || null,
        email: data.founder.email || null,
        national_id: data.founder.national_id,
        father_id: father ? father.id : null,
        mother_id: mother ? mother.id : null,
        role: "ROOT_ADMIN",
        has_account: 1,
        account_status: "ACTIVE",
        is_alive: data.founder.is_alive ?? 1
    });

    // 5. CREATE USER ACCOUNT
    const hashedPassword = await bcrypt.hash(data.founder.password, 10);

    const user = await userRepository.createUser({
        member_id: founder.id,
        username: data.founder.username,
        password: hashedPassword
    });

    // 6. UPDATE FAMILY WITH created_by (AUTOMATICALLY SET TO FOUNDER'S USER ID)
    await pool.query(
        `UPDATE families SET created_by = $1 WHERE id = $2`,
        [user.id, family.id]
    );

    // 7. CREATE SPOUSE
    if (data.spouse) {
        const spouse = await memberRepository.createMember({
            family_id: family.id,
            first_name: data.spouse.first_name,
            middle_name: data.spouse.middle_name || null,
            last_name: data.spouse.last_name,
            gender: data.spouse.gender,
            date_of_birth: data.spouse.date_of_birth,
            phone: data.spouse.phone || null,
            email: data.spouse.email || null,
            national_id: data.spouse.national_id,
            role: "MEMBER",
            is_alive: data.spouse.is_alive ?? 1
        });

        await memberRepository.addSpouse(founder.id, spouse.id);
    }

    // 8. CREATE SIBLINGS
    if (data.siblings && data.siblings.length > 0) {
        for (const sibling of data.siblings) {
            await memberRepository.createMember({
                family_id: family.id,
                first_name: sibling.first_name,
                middle_name: sibling.middle_name || null,
                last_name: sibling.last_name,
                gender: sibling.gender,
                date_of_birth: sibling.date_of_birth,
                phone: sibling.phone || null,
                email: sibling.email || null,
                national_id: sibling.national_id,
                father_id: father ? father.id : null,
                mother_id: mother ? mother.id : null,
                role: "SUB_ROOT_ADMIN",
                is_alive: sibling.is_alive ?? 1
            });
        }
    }

    return {
        family,
        founder,
        user
    };
};

// ============================================================
// GET ALL FAMILIES
// ============================================================

const getFamilies = async () => {
    return await familyRepository.getFamilies();
};

// ============================================================
// GET ONE FAMILY
// ============================================================

const getFamily = async (id) => {
    return await familyRepository.getFamily(id);
};

// ============================================================
// CREATE FAMILY
// ============================================================

const createFamily = async (data) => {
    const familyData = data.family || data;
    return await familyRepository.createFamily(familyData);
};

// ============================================================
// UPDATE FAMILY
// ============================================================

const updateFamily = async (id, data) => {
    return await familyRepository.updateFamily(id, data);
};

// ============================================================
// DELETE FAMILY
// ============================================================

const deleteFamily = async (id) => {
    return await familyRepository.deleteFamily(id);
};

// ============================================================
// GET FAMILY MEMBERS
// ============================================================

const getFamilyMembers = async (familyId) => {
    return await familyRepository.getFamilyMembers(familyId);
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
    registerFamily,
    getFamilies,
    getFamily,
    createFamily,
    updateFamily,
    deleteFamily,
    getFamilyMembers
};