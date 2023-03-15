const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class RecommendationRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async createRecommendation(recommendation) {
        let data = {};

        try {
            data = await this.db.recommendation.create(recommendation);
        } catch (err) {
            logger.error(`Error::${err}`);
        }

        return data;
    }

    async getPageOfRecommendations(titleId, pageLength, pageNum) {
        try {
            const recommendations = await this.db.sequelize.query(
                'SELECT * FROM recommendations WHERE recommendations."title1Id" = :titleId OR recommendations."title2Id" = :titleId OFFSET :offset FETCH FIRST :pageLength ROWS ONLY',
                {
                    replacements: {
                        titleId, offset: pageLength * (pageNum - 1), pageLength,
                    },
                    model: this.db.recommendation.Recommendation,
                    type: this.db.sequelize.QueryTypes.SELECT,
                },
            );

            return recommendations;
        } catch (err) {
            logger.error(`Error::${err}`);
            return [];
        }
    }
}

module.exports = new RecommendationRepository();
