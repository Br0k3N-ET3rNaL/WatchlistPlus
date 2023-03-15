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

        let user = null;
        if (userExists && passwordsMatch) {
            user = { id: userResult.id, username: userResult.username };
        }

        return { userExists, passwordsMatch, user };
    }

    async createUser(user) {
        return userRepository.createUser(user);
    }

    #validEmail(email) {
        return email.match('(^[^@]*@[^.]*\\..*)');
    }
}

module.exports = new UserService();
