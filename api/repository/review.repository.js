const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class ReviewRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async createReview(review) {
        let data = {};

        try {
            data = await this.db.review.create(review);
        } catch (err) {
            logger.error(`Error::${err}`);
        }

        return data;
    }
}

module.exports = new ReviewRepository();
