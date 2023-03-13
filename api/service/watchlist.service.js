const watchlistRepository = require('../repository/watchlist.repository');

class WatchlistService {
    async createWatched(watched) {
        return watchlistRepository.createWatched(watched);
    }

    async getPageOfWatched(userID, pageLength, pageNum, sortColumn) {
        const results = await watchlistRepository.getPageOfWatched(userID, pageLength, pageNum, sortColumn);
        let watched;
        if (Array.isArray(results)) {
            watched = results.map((w) => ({
                rating: w.rating,
                status: w.status,
                title: {
                    id: w.title.id,
                    title: w.title.title,
                    type: w.title.type,
                    description: w.title.description,
                    releaseYear: w.title.releaseYear,
                    ageGuidance: w.title.ageGuidance,
                    runtime: w.title.runtime,
                    rating: w.title.imdbScore,
                    genres: w.title.genres,
                },
            }));
        }
        return watched;
    }
}

module.exports = new WatchlistService();
