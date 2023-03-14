const reviewService = require('../service/review.service');
const logger = require('../logger/api.logger');

class ReviewController {
    async createReview(review) {
        logger.info('ReviewController: createReview', `${review.review} ${review.username} ${review.titleId}`);
        return reviewService.createReview(review);
    }

    async getPageOfReviews(titleId, pageLength, pageNum) {
        logger.info('ReviewController: getPageOfReview', `${titleId} ${pageLength} ${pageNum}`);
        return reviewService.getPageOfReviews(titleId, pageLength, pageNum);
    }
}

module.exports = new ReviewController();
