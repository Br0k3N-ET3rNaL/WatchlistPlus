const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class UserRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async getUserByUsername(username) {
        try {
            const user = await this.db.user.findOne({ where: { username } });
            return user;
        } catch (err) {
            logger.error(`Error::${err}`);
            return [];
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await this.db.user.findOne({ where: { email } });
            return user;
        } catch (err) {
            logger.error(`Error::${err}`);
            return [];
        }
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
