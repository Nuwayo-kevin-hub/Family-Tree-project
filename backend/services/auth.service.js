const authRepository = require("../repositories/auth.repository");

const login = async (data) => {
    return await authRepository.login(data);
};

module.exports = {
    login
};