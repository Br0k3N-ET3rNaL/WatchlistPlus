const titleService = require('../service/title.service');
const logger = require('../logger/api.logger');

class TitleController {
    async getPageOfTitles(pageLength, pageNum, sortColumn, search) {
        logger.info('TitleController: getPageOfTitles', `${pageLength} ${pageNum} ${sortColumn} ${search}`);
        return titleService.getPageOfTitles(pageLength, pageNum, sortColumn, search);
    }

    async getPageOfTitlesWithWatched(userId, pageLength, pageNum, sortColumn, search) {
        logger.info('TitleController: getPageOfTitles', `${userId} ${pageLength} ${pageNum} ${sortColumn} ${search}`);
        return titleService.getPageOfTitlesWithWatched(userId, pageLength, pageNum, sortColumn, search);
    }
}

module.exports = new TitleController();
