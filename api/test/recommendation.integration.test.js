const request = require('supertest');
const app = require('../server');
const recommendationRepository = require('../repository/recommendation.repository');
const userRepository = require('../repository/user.repository');
const logger = require('../logger/api.logger');

describe('review', () => {
    const loggerSpy = jest.spyOn(logger, 'error');
    let testUser;
    let testRecommendation;

    beforeAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        recommendationRepository.db.recommendation.truncate({ restartIdentity: true });
        testUser = await userRepository.createUser({ email: 'test@gmail.com', username: 'TestUser', password: 'password' });
    });

    afterAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        recommendationRepository.db.recommendation.truncate({ restartIdentity: true });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    test('create recommendation', async () => {
        const spy = jest.spyOn(recommendationRepository, 'createRecommendation');

        testRecommendation = {
            title1Id: 'tm1143265', title2Id: 'tm84618', userId: testUser.id,
        };

        await request(app)
            .post('/api/recommendations/')
            .send({ recommendation: testRecommendation })
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toEqual(expect.objectContaining(testRecommendation));
            });

        const testRecommendation2 = {
            title1Id: 'notATitleId', title2Id: testRecommendation.title2Id, userId: testRecommendation.userId,
        };

        await request(app)
            .post('/api/recommendations/')
            .send({ recommendation: testRecommendation2 })
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeForeignKeyConstraintError: insert or update on table "recommendations" violates foreign key constraint "recommendations_title1Id_fkey"');
            });
    });

    test('get recommendations', async () => {
        const spy = jest.spyOn(recommendationRepository, 'getPageOfRecommendations');

        await request(app)
            .get(`/api/recommendations/${testRecommendation.title1Id}/50/1`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body[0].title1Id).toBe(testRecommendation.title1Id);
                expect(res.body[0].title2Id).toBe(testRecommendation.title2Id);
                expect(res.body[0].count).toBe('1');
            });

        await request(app)
            .get(`/api/recommendations/${testRecommendation.title2Id}/50/1`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturnedTimes(2);
                expect(res.body[0].title1Id).toBe(testRecommendation.title2Id);
                expect(res.body[0].title2Id).toBe(testRecommendation.title1Id);
                expect(res.body[0].count).toBe('1');
            });

        await request(app)
            .get(`/api/recommendations/${testRecommendation.title1Id}/test/1`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: column "nan" does not exist');
            });
    });
});
