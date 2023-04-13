const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class UserRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async getUserByUsername(username) {
        const user = await this.db.user.findOne({ where: { username } });
        return user;
    }

    async getUserByEmail(email) {
        const user = await this.db.user.findOne({ where: { email } });
        return user;
    }

    async createUser(user) {
        let data = {};

        try {
            data = await this.db.user.create(user);
        } catch (err) {
            logger.error(`Error::${err}`);
        }

        return data;
    }
}

module.exports = new UserRepository();
