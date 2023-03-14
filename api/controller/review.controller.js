const reviewService = require('../service/review.service');
const logger = require('../logger/api.logger');

class ReviewController {
    async createReview(review) {
        logger.info('ReviewController: createReview', `${review.review} ${review.username} ${review.titleId}`);
        return reviewService.createReview(review);
    }
}

module.exports = new ReviewController();
