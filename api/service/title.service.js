const titleRepository = require('../repository/title.repository');

class TitleService {
    async getPageOfTitles(pageLength, pageNum, sortColumn) {
        const results = await titleRepository.getPageOfTitles(pageLength, pageNum, sortColumn);
        let titles;
        if (Array.isArray(results)) {
            titles = results.map((t) => (
                { title: t.title, releaseYear: t.releaseYear, rating: t.imdbScore }));
        }
        return titles;
    }
}

module.exports = new TitleService();
