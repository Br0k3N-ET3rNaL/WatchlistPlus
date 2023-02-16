const titleRepository = require('../repository/title.repository');

class TitleService {
    async getPageOfTitles(pageLength, pageNum, sortColumn) {
        return titleRepository.getPageOfTitles(pageLength, pageNum, sortColumn);
    }
}

module.exports = new TitleService();
