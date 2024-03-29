const request = require('supertest');
const app = require('../server');
const titleRepository = require('../repository/title.repository');
const userRepository = require('../repository/user.repository');
const logger = require('../logger/api.logger');

describe('title', () => {
    const loggerSpy = jest.spyOn(logger, 'error');
    let testUser;

    beforeAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
        testUser = await userRepository.createUser({ email: 'test@gmail.com', username: 'TestUser', password: 'password' });
    });

    afterAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
    });

    afterEach(async () => {
        jest.clearAllMocks();
    });

    test('verify title', async () => {
        const testTitle = {
            id: 'tm1143265', title: 'Incantation', type: 'MOVIE', releaseYear: 2022,
        };
        const spy = jest.spyOn(titleRepository, 'getTitlesByTitle');

        await request(app)
            .get(`/api/titles/verify/${testTitle.title}/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body.exists).toBeTruthy();
                expect(res.body.duplicates).toBeFalsy();
                expect(res.body.id).toBe(testTitle.id);
            });
    });

    test('verify title with duplicate', async () => {
        const testTitle1 = {
            id: 'tm84618', title: 'Taxi Driver', type: 'MOVIE', releaseYear: 1976,
        };
        const testTitle2 = {
            id: 'tm248010', title: 'Taxi Driver', type: 'MOVIE', releaseYear: 2015,
        };
        let spy = jest.spyOn(titleRepository, 'getTitlesByTitle');

        await request(app)
            .get(`/api/titles/verify/${testTitle1.title}/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body.exists).toBeTruthy();
                expect(res.body.duplicates).toBeTruthy();
                expect(res.body.id).toBe(undefined);
            });

        spy = jest.spyOn(titleRepository, 'getTitle');

        await request(app)
            .get(`/api/titles/verify/${testTitle1.title}/${testTitle1.type}/${testTitle1.releaseYear}`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body.exists).toBeTruthy();
                expect(res.body.duplicates).toBeFalsy();
                expect(res.body.id).not.toBe(testTitle2.id);
                expect(res.body.id).toBe(testTitle1.id);
            });

        await request(app)
            .get(`/api/titles/verify/${testTitle1.title}/${testTitle1.type}/test`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: invalid input syntax for type integer: "test"');
            });
    });

    test('get titles', async () => {
        const spy = jest.spyOn(titleRepository, 'getPageOfTitles');

        await request(app)
            .get('/api/titles/page/50/1/tmdbPopularity/ /')
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toHaveLength(50);
            });

        await request(app)
            .get('/api/titles/page/50/1/notAColumn/ /')
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::notAColumn does not exists in titles');
            });

        await request(app)
            .get('/api/titles/page/50/test/tmdbPopularity/ /')
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: column "nan" does not exist');
            });
    });

    test('get titles with watched', async () => {
        const spy = jest.spyOn(titleRepository, 'getPageOfTitlesWithWatched');

        await request(app)
            .get(`/api/titles/page/withWatched/${testUser.id}/50/1/tmdbPopularity/ /`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toHaveLength(50);
            });

        await request(app)
            .get(`/api/titles/page/withWatched/${testUser.id}/50/1/notAColumn/ /`)
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::notAColumn does not exists in titles');
            });

        await request(app)
            .get('/api/titles/page/withWatched/test/50/1/tmdbPopularity/ /')
            .send()
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeDatabaseError: invalid input syntax for type integer: "test"');
            });
    });
});
