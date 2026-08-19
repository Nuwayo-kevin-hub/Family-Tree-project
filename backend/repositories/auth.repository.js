const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async ({ username, password }) => {
    try {

        const sql = `
            SELECT
                u.id,
                u.username,
                u.password,

                m.id AS member_id,
                m.first_name,
                m.last_name,
                m.role,
                m.family_id

            FROM users u

            INNER JOIN members m
                ON u.member_id = m.id

            WHERE u.username = $1
        `;

        const result = await pool.query(
            sql,
            [username]
        );

        if (result.rows.length === 0) {

            return {
                success: false,
                message: "Invalid Username"
            };

        }

        const user = result.rows[0];

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {

            return {
                success: false,
                message: "Invalid Password"
            };

        }

        // =====================================================
        // JWT
        // IMPORTANT:
        // id = users.id
        // member_id = members.id
        // role = members.role
        // =====================================================

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                family_id: user.family_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        return {
            success: true,
            token,
            user
        };

    }
    catch (error) {

        throw error;

    }
};

module.exports = {
    login
};