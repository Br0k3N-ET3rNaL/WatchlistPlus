const userRepository = require('../repository/user.repository');

class UserService {
    async usernameExists(username) {
        const userResult = await userRepository.getUserByUsername(username);

        return { usernameExists: userResult !== null };
    }

    async emailExists(email) {
        const userResult = await userRepository.getUserByEmail(email);

        return { emailExists: userResult !== null };
    }

    async verifyUser(email, password) {
        const userResult = await userRepository.getUserByEmail(email);
        const userExists = (userResult !== null);
        let passwordsMatch = true;

        if (userResult !== null) {
            passwordsMatch = (userResult.password === password);
        }

        return { userExists, passwordsMatch };
    }

    async createUser(user) {
        return userRepository.createUser(user);
    }
}

module.exports = new UserService();
