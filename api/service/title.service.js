const titleRepository = require('../repository/title.repository');

class TitleService {
    async verifyTitle(title, type, releaseYear) {
        let titles;

        if (type && releaseYear) {
            titles = await titleRepository.getTitle(title, type, releaseYear);
        } else {
            titles = await titleRepository.getTitlesByTitle(title);
        }

        let exists = false;
        let duplicates = false;
        let id;

        if (titles) {
            if (titles.length > 0 && titles[0]) {
                exists = true;
            }
            if (titles.length > 1) {
                duplicates = true;
            } else if (titles.length === 1 && titles[0]) {
                id = titles[0].id;
            }
        }

        return { exists, duplicates, id };
    }

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
