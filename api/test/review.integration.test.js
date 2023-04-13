const request = require('supertest');
const app = require('../server');
const reviewRepository = require('../repository/review.repository');
const userRepository = require('../repository/user.repository');
const logger = require('../logger/api.logger');

describe('review', () => {
    const loggerSpy = jest.spyOn(logger, 'error');
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

    afterEach(async () => {
        jest.clearAllMocks();
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

        const testReview2 = {
            username: testReview.username, review: testReview.review, titleId: 'notATitleId', userId: testReview.userId,
        };

        await request(app)
            .post('/api/reviews/')
            .send({ review: testReview2 })
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeForeignKeyConstraintError: insert or update on table "reviews" violates foreign key constraint "reviews_titleId_fkey"');
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

        await request(app)
            .get(`/api/reviews/${testReview.titleId}/test/1/`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: column "nan" does not exist');
            });
    });
});
