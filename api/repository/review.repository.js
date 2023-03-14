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

    async getPageOfReviews(titleId, pageLength, pageNum) {
        try {
            const reviews = await this.db.sequelize.query(
                'SELECT * FROM reviews WHERE reviews."titleId" = :titleId OFFSET :offset FETCH FIRST :pageLength ROWS ONLY',
                {
                    replacements: {
                        titleId, offset: pageLength * (pageNum - 1), pageLength,
                    },
                    model: this.db.review.Review,
                    type: this.db.sequelize.QueryTypes.SELECT,
                },
            );

            return reviews;
        } catch (err) {
            logger.error(`Error::${err}`);
            return [];
        }
    }
}

module.exports = new ReviewRepository();
