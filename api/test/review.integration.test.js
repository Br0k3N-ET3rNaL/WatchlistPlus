const request = require('supertest');
const app = require('../server');
const reviewRepository = require('../repository/review.repository');
const userRepository = require('../repository/user.repository');

describe('review', () => {
    let testUser;
    let testReview;

    beforeAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        reviewRepository.db.review.truncate({ restartIdentity: true });
        testUser = await userRepository.createUser({ email: 'test@gmail.com', username: 'TestUser', password: 'password' });
    });

    afterAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        reviewRepository.db.review.truncate({ restartIdentity: true });
    });

    test('create review', async () => {
        const spy = jest.spyOn(reviewRepository, 'createReview');

        testReview = {
            username: testUser.username, review: 'Test review', titleId: 'tm1143265', userId: testUser.id,
        };

        await request(app)
            .post('/api/reviews/')
            .send({ review: testReview })
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toEqual(expect.objectContaining(testReview));
            });
    });

    test('get reviews', async () => {
        const spy = jest.spyOn(reviewRepository, 'getPageOfReviews');

        await request(app)
            .get(`/api/reviews/${testReview.titleId}/50/1/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body[0].username).toBe(testReview.username);
                expect(res.body[0].review).toBe(testReview.review);
            });
    });
});
