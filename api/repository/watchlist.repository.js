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

    async deleteWatched(userId, titleId) {
        try {
            await this.db.watched.destroy({ where: { titleId, userId } });
        } catch (err) {
            logger.error(`Error::${err}`);
        }
    }

    async getPageOfWatched(userId, pageLength, pageNum, sortColumn, filter) {
        if (this.db.watched.rawAttributes[sortColumn]) {
            let statusFilter = '';

            if (filter === 'Plan To Watch' || filter === 'Watching' || filter === 'Completed') {
                statusFilter = filter;
            }

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
                    WHERE w."userId" = :userId AND w.status ILIKE :statusFilter
                    ORDER BY w."${sortColumn}" DESC NULLS LAST OFFSET :offset FETCH FIRST :pageLength ROWS ONLY`,
                    {
                        replacements: {
                            userId, offset: pageLength * (pageNum - 1), pageLength, statusFilter: `${statusFilter}%`,
                        },
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
