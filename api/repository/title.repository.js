const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class TitleRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async getPageOfTitles(pageLength, pageNum, sortColumn, search) {
        // Prevent injection
        if (this.db.title.rawAttributes[sortColumn]) {
            try {
                const titles = await this.db.sequelize.query(
                    `SELECT * FROM titles WHERE title ILIKE :search AND "${sortColumn}" IS NOT NULL ORDER BY "${sortColumn}" DESC OFFSET :offset FETCH FIRST :pageLength ROWS ONLY`,
                    {
                        replacements: { search: `%${search}%`, offset: pageLength * (pageNum - 1), pageLength },
                        model: this.db.title,
                    },
                );
                return titles;
            } catch (err) {
                logger.error(`Error::${err}`);
                return [];
            }
        } else {
            logger.error(`Error::${sortColumn} does not exists in titles`);
            return [];
        }
    }

    async getPageOfTitlesWithWatched(userId, pageLength, pageNum, sortColumn, search) {
        // Prevent injection
        if (this.db.title.rawAttributes[sortColumn]) {
            try {
                const titles = await this.db.sequelize.query(
                    `SELECT t.*, w.rating as "watched.rating", w.status as "watched.status", w."titleId" as "watched.titleId", w."userId" as "watched.userId"
                    FROM (SELECT * FROM titles WHERE title ILIKE :search AND "${sortColumn}" IS NOT NULL ORDER BY "${sortColumn}" DESC OFFSET :offset FETCH FIRST :pageLength ROWS ONLY) AS t 
                    LEFT OUTER JOIN (SELECT * FROM watched WHERE watched."userId" = :userId) AS w ON t.id = w."titleId" ORDER BY t."${sortColumn}" DESC`,
                    {
                        replacements: {
                            userId, search: `%${search}%`, offset: pageLength * (pageNum - 1), pageLength,
                        },
                        model: this.db.title.Title,
                        nest: true,
                        type: this.db.sequelize.QueryTypes.SELECT,
                    },
                );
                return titles;
            } catch (err) {
                logger.error(`Error::${err}`);
                return [];
            }
        } else {
            logger.error(`Error::${sortColumn} does not exists in titles`);
            return [];
        }
    }
}

module.exports = new TitleRepository();
