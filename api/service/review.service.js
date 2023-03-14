const reviewRepository = require('../repository/review.repository');

class ReviewService {
    async createReview(review) {
        return reviewRepository.createReview(review);
    }
}

module.exports = new ReviewService();
