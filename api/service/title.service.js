const titleRepository = require('../repository/title.repository');

class TitleService {
    async getPageOfTitles(pageLength, pageNum, sortColumn, search) {
        const results = await titleRepository.getPageOfTitles(pageLength, pageNum, sortColumn, search);
        let titles;
        if (Array.isArray(results)) {
            titles = results.map((t) => (
                {
                    id: t.id, title: t.title, type: t.type, description: t.description, releaseYear: t.releaseYear, ageGuidance: t.ageGuidance, runtime: t.runtime, rating: t.imdbScore, genres: t.genres,
                }));
        }
        return titles;
    }

    async getPageOfTitlesWithWatched(userId, pageLength, pageNum, sortColumn, search) {
        const results = await titleRepository.getPageOfTitlesWithWatched(userId, pageLength, pageNum, sortColumn, search);
        let titles;
        if (Array.isArray(results)) {
            titles = results.map((t) => (
                {
                    id: t.id, title: t.title, type: t.type, description: t.description, releaseYear: t.releaseYear, ageGuidance: t.ageGuidance, runtime: t.runtime, rating: t.imdbScore, genres: t.genres, watched: t.watched,
                }));
        }
        return titles;
    }
}

module.exports = new TitleService();
