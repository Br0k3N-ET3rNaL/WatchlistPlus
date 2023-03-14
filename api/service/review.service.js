const reviewRepository = require('../repository/review.repository');

class ReviewService {
    async createReview(review) {
        return reviewRepository.createReview(review);
    }

    async getPageOfReviews(titleId, pageLength, pageNum) {
        const results = await reviewRepository.getPageOfReviews(titleId, pageLength, pageNum);

        let reviews;
        if (Array.isArray(results)) {
            reviews = results.map((r) => ({
                username: r.username,
                review: r.review,
            }));
        }

        return reviews;
    }
}

module.exports = new ReviewService();
