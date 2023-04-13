const request = require('supertest');
const app = require('../server');
const watchlistRepository = require('../repository/watchlist.repository');
const userRepository = require('../repository/user.repository');
const logger = require('../logger/api.logger');

describe('watchlist', () => {
    const loggerSpy = jest.spyOn(logger, 'error');
    let testUser;
    let testWatched;
    let testWatched2;

    beforeAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        watchlistRepository.db.watched.truncate({ restartIdentity: true });
        testUser = await userRepository.createUser({ email: 'test@gmail.com', username: 'TestUser', password: 'password' });
    });

    afterAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        watchlistRepository.db.watched.truncate({ restartIdentity: true });
    });

    afterEach(async () => {
        jest.clearAllMocks();
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

        testWatched2 = {
            rating: testWatched.rating, status: testWatched.status, titleId: 'notATitleId', userId: testWatched.userId,
        };

        await request(app)
            .post('/api/watchlist/')
            .send({ watched: testWatched2 })
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeForeignKeyConstraintError: insert or update on table "watched" violates foreign key constraint "watched_titleId_fkey"');
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

        testWatched2.titleId = testWatched.titleId;
        testWatched2.rating = 'notANumber';

        await request(app)
            .put('/api/watchlist/')
            .send({ watched: testWatched2 })
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: invalid input syntax for type integer: "notANumber"');
            });
    });

    test('get watched', async () => {
        const spy = jest.spyOn(watchlistRepository, 'getPageOfWatched');

        await request(app)
            .get(`/api/watchlist/${testUser.id}/50/1/status/${testWatched.status}/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body[0].rating).toBe(testWatched.rating);
                expect(res.body[0].status).toBe(testWatched.status);
                expect(res.body[0].title.id).toBe(testWatched.titleId);
            });

        await request(app)
            .get(`/api/watchlist/${testUser.id}/50/1/notAColumn/All/`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::notAColumn does not exists in titles');
            });

        await request(app)
            .get(`/api/watchlist/${testUser.id}/notANumber/1/status/All/`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: column "nan" does not exist');
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

        await request(app)
            .delete(`/api/watchlist/notANumber/${testWatched.titleId}`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: invalid input syntax for type integer: "notANumber"');
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
