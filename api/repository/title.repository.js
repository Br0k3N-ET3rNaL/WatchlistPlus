const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class TitleRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async getPageOfTitles(pageLength, pageNum, sortColumn) {
        // Prevent injection
        if (this.db.title.rawAttributes[sortColumn]) {
            try {
                logger.info(sortColumn);
                const titles = await this.db.sequelize.query(
                    `SELECT * FROM titles WHERE "${sortColumn}" IS NOT NULL ORDER BY "${sortColumn}" DESC OFFSET :offset FETCH FIRST :pageLength ROWS ONLY`,
                    {
                        replacements: { offset: pageLength * (pageNum - 1), pageLength },
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
}

module.exports = new TitleRepository();
