const userRepository = require('../repository/user.repository');

class UserService {
    async usernameExists(username) {
        const userResult = await userRepository.getUserByUsername(username);

        return { usernameExists: userResult !== null };
    }

    async emailExists(email) {
        let userResult = null;

        if (this.#validEmail(email)) {
            userResult = await userRepository.getUserByEmail(email);
        }

        return { emailExists: userResult !== null };
    }

    async verifyUser(email, password) {
        let userResult = null;

        if (this.#validEmail(email)) {
            userResult = await userRepository.getUserByEmail(email);
        }

        const userExists = (userResult !== null);
        let passwordsMatch = true;

        if (userResult !== null) {
            passwordsMatch = (userResult.password === password);
        }

        let userID = null;
        if (userExists && passwordsMatch) {
            userID = userResult.id;
        }

        return { userExists, passwordsMatch, userID };
    }

    async createUser(user) {
        return userRepository.createUser(user);
    }

    #validEmail(email) {
        return email.match('(^[^@]*@[^.]*\\..*)');
    }
}

module.exports = new UserService();
