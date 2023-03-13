const { connect } = require('../config/db.config');
const logger = require('../logger/api.logger');

class WatchlistRepository {
    db = {};

    constructor() {
        this.db = connect();
    }

    async createWatched(watched) {
        let data = {};

        try {
            data = await this.db.watched.create(watched);
        } catch (err) {
            logger.error(`Error::${err}`);
        }

        return data;
    }

    async updateWatched(watched) {
        let data = {};

        try {
            data = await this.db.watched.update(watched, { where: { titleId: watched.titleId, userId: watched.userId } });
        } catch (err) {
            logger.error(`Error::${err}`);
        }

        return data;
    }

    async getPageOfWatched(userID, pageLength, pageNum, sortColumn) {
        if (this.db.title.rawAttributes[sortColumn]) {
            try {
                const watchlist = await this.db.sequelize.query(
                    `SELECT w.*,
                    titles.id as "title.id", 
                    titles.title as "title.title", 
                    titles.type as "title.type", 
                    titles.description as "title.description", 
                    titles."releaseYear" as "title.releaseYear", 
                    titles."ageCertification" as "title.ageCertification", 
                    titles.runtime as "title.runtime", 
                    titles.genres as "title.genres", 
                    titles."productionCountries" as "title.productionCountries", 
                    titles.seasons as "title.seasons", 
                    titles."imdbId" as "title.imdbId", 
                    titles."imdbScore" as "title.imdbScore", 
                    titles."imdbVotes" as "title.imdbVotes", 
                    titles."tmdbPopularity" as "title.tmdbPopularity", 
                    titles."tmdbScore" as "title.tmdbScore"  
                    FROM watched as w LEFT OUTER JOIN titles ON w."titleId" = titles.id
                    WHERE "userId" = :userID AND "${sortColumn}" IS NOT NULL 
                    ORDER BY "${sortColumn}" DESC OFFSET :offset FETCH FIRST :pageLength ROWS ONLY`,
                    {
                        replacements: { userID, offset: pageLength * (pageNum - 1), pageLength },
                        model: this.db.watched.Watched,
                        nest: true,
                        type: this.db.sequelize.QueryTypes.SELECT,
                    },
                );
                return watchlist;
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

module.exports = new WatchlistRepository();
