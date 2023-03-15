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
                `SELECT "title1Id", "title1Title", "title2Id", title AS "title2Title", count FROM
                    (SELECT "title1Id", title as "title1Title", "title2Id", count FROM   
                        (SELECT a."title1Id", a."title2Id", sum(a.count) AS count FROM
                            (SELECT "title1Id", "title2Id", count("userId") FROM recommendations WHERE "title1Id" = 'tm1143265' GROUP BY "title1Id", "title2Id"
                            UNION ALL
                            SELECT "title2Id" AS "title1Id", "title1Id" AS "title2Id", count("userId") FROM recommendations WHERE "title2Id" = 'tm1143265' GROUP BY "title1Id", "title2Id") AS a
                        GROUP BY "title1Id", "title2Id") AS b
                    LEFT OUTER JOIN titles ON b."title1Id" = titles.id) AS c
                LEFT OUTER JOIN titles ON c."title2Id" = titles.id
                OFFSET :offset FETCH FIRST :pageLength ROWS ONLY`,
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
