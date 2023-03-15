const recommendationService = require('../service/recommendation.service');
const logger = require('../logger/api.logger');

class RecommendationController {
    async createRecommendation(recommendation) {
        logger.info('RecommendationController: createRecommendation');
        return recommendationService.createReview(recommendation);
    }

    async getPageOfRecommendations(titleId, pageLength, pageNum) {
        logger.info('RecommendationController: getPageOfRecommendations', `${titleId} ${pageLength} ${pageNum}`);
        return recommendationService.getPageOfRecommendations(titleId, pageLength, pageNum);
    }
}

module.exports = new RecommendationController();
