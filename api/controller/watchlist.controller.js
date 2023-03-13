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

    async deleteWatched(userId, titleId) {
        logger.info('WatchlistController: deleteWatched', `${userId} ${titleId}`);
        await watchlistService.deleteWatched(userId, titleId);
    }

    async getPageOfWatched(userId, pageLength, pageNum, sortColumn) {
        logger.info('WatchlistController: getPageOfTitles', `${userId} ${pageLength} ${pageNum} ${sortColumn}`);
        return watchlistService.getPageOfWatched(userId, pageLength, pageNum, sortColumn);
    }
}

module.exports = new WatchlistController();
