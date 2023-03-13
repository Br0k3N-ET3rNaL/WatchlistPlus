const watchlistService = require('../service/watchlist.service');
const logger = require('../logger/api.logger');

class WatchlistController {
    async createWatched(watched) {
        logger.info('WatchlistController: createWatched', `${watched.rating} ${watched.status} ${watched.titleId} ${watched.userId}`);
        return watchlistService.createWatched(watched);
    }

    async updateWatched(watched) {
        logger.info('WatchlistController: updateWatched', `${watched.rating} ${watched.status} ${watched.titleId} ${watched.userId}`);
        return watchlistService.updateWatched(watched);
    }

    async getPageOfWatched(userID, pageLength, pageNum, sortColumn) {
        logger.info('WatchlistController: getPageOfTitles', `${userID} ${pageLength} ${pageNum} ${sortColumn}`);
        return watchlistService.getPageOfWatched(userID, pageLength, pageNum, sortColumn);
    }
}

module.exports = new WatchlistController();
