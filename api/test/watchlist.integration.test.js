const request = require('supertest');
const app = require('../server');
const watchlistRepository = require('../repository/watchlist.repository');
const userRepository = require('../repository/user.repository');

describe('watchlist', () => {
    let testUser;
    let testWatched;

    beforeAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        watchlistRepository.db.watched.truncate({ restartIdentity: true });
        testUser = await userRepository.createUser({ email: 'test@gmail.com', username: 'TestUser', password: 'password' });
    });

    afterAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        watchlistRepository.db.watched.truncate({ restartIdentity: true });
    });

    test('create watched', async () => {
        const spy = jest.spyOn(watchlistRepository, 'createWatched');

        testWatched = {
            rating: 0, status: 'Plan To Watch', titleId: 'tm1143265', userId: testUser.id,
        };

        await request(app)
            .post('/api/watchlist/')
            .send({ watched: testWatched })
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toEqual(expect.objectContaining(testWatched));
            });
    });

    test('update watched', async () => {
        const spy = jest.spyOn(watchlistRepository, 'updateWatched');

        testWatched.rating = 10;
        testWatched.status = 'Completed';

        await request(app)
            .put('/api/watchlist/')
            .send({ watched: testWatched })
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toEqual([1]);
            });
    });

    test('get watched', async () => {
        const spy = jest.spyOn(watchlistRepository, 'getPageOfWatched');

        await request(app)
            .get(`/api/watchlist/${testUser.id}/50/1/status/All/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body[0].rating).toBe(testWatched.rating);
                expect(res.body[0].status).toBe(testWatched.status);
                expect(res.body[0].title.id).toBe(testWatched.titleId);
            });
    });

    test('delete watched', async () => {
        let spy = jest.spyOn(watchlistRepository, 'deleteWatched');

        await request(app)
            .delete(`/api/watchlist/${testUser.id}/${testWatched.titleId}`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toBeFalsy();
            });

        spy = jest.spyOn(watchlistRepository, 'getPageOfWatched');

        await request(app)
            .get(`/api/watchlist/${testUser.id}/50/1/status/All/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body[0]).toBeFalsy();
            });
    });
});
