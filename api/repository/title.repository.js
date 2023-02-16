const { QueryTypes } = require('sequelize');
const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class TitleRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async getPageOfTitles(pageLength, pageNum, sortColumn) {
        try {
            const titles = await this.db.sequelize.query(
                'SELECT * FROM title ORDER BY :sortColumn OFFSET :offset FETCH FIRST :n ROWS ONLY',
                {
                    replacements: { sortColumn, offset: pageLength * (pageNum - 1), n: pageLength },
                    type: QueryTypes.SELECT,
                },
            );
            return titles;
        } catch (err) {
            logger.error(`Error::${err}`);
            return [];
        }
    }
}

module.exports = new TitleRepository();
