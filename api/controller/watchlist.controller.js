const watchlistService = require('../service/watchlist.service');
const logger = require('../logger/api.logger');

class WatchlistController {
    async getPageOfWatched(userID, pageLength, pageNum, sortColumn) {
        logger.info('WatchlistController: getPageOfTitles', `${userID} ${pageLength} ${pageNum} ${sortColumn}`);
        return watchlistService.getPageOfWatched(userID, pageLength, pageNum, sortColumn);
    }
}

module.exports = new WatchlistController();
