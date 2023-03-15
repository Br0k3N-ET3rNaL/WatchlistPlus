const recommendationRepository = require('../repository/recommendation.repository');

class RecommendationService {
    async createRecommendation(recommendation) {
        return recommendationRepository.createRecommendation(recommendation);
    }

    async getPageOfRecommendations(titleId, pageLength, pageNum) {
        const results = await recommendationRepository.getPageOfRecommendations(titleId, pageLength, pageNum);

        let recommendations;
        if (Array.isArray(results)) {
            recommendations = results.map((r) => ({
                title1Id: r.title1Id,
                title1Title: r.title1Title,
                title2Id: r.title2Id,
                title2Title: r.title2Title,
                count: r.count,
            }));
        }

        return recommendations;
    }
}

module.exports = new RecommendationService();
