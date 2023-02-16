const titleService = require('../service/title.service');
const logger = require('../logger/api.logger');

class TitleController {
    async getPageOfTitles(pageLength, pageNum, sortColumn) {
        logger.info('TitleController: getPageOfTitles', `${pageLength} ${pageNum} ${sortColumn}`);
        return titleService.getPageOfTitles(pageLength, pageNum, sortColumn);
    }
}

module.exports = new TitleController();
