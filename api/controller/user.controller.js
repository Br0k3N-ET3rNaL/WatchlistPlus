const userService = require('../service/user.service');
const logger = require('../logger/api.logger');

class UserController {
    async usernameExists(username) {
        logger.info('UserController: usernameExists', username);
        return userService.usernameExists(username);
    }

    async emailExists(email) {
        logger.info('UserController: emailExists', email);
        return userService.emailExists(email);
    }

    async verifyUser(email, password) {
        logger.info('UserController: verifyUser', `${email} ${password}`);
        return userService.verifyUser(email, password);
    }

    async createUser(user) {
        logger.info('UserController: createUser', user);
        return userService.createUser(user);
    }
}

module.exports = new UserController();
