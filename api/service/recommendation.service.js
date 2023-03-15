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
                username: r.username,
                recommendation: r.recommendation,
            }));
        }

        return recommendations;
    }
}

module.exports = new RecommendationService();
