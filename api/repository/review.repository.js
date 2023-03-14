const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class ReviewRepository {
    db = {};

    constructor() {
        this.db = connect();
    }
}

module.exports = new ReviewRepository();
