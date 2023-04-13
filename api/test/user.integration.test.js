const request = require('supertest');
const app = require('../server');
const userRepository = require('../repository/user.repository');
const logger = require('../logger/api.logger');

describe('user', () => {
    const testUser = { email: 'test@gmail.com', username: 'TestUser', password: 'password' };

    beforeEach(async () => {
        jest.resetAllMocks();
    });

    beforeAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
    });

    afterAll(async () => {
        userRepository.db.user.truncate({ cascade: true, restartIdentity: true });
    });

    test('create user', async () => {
        const spy = jest.spyOn(userRepository, 'createUser');

        await request(app)
            .post('/api/users/')
            .send({ user: testUser })
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toEqual(expect.objectContaining(testUser));
            });

        const loggerSpy = jest.spyOn(logger, 'error');

        await request(app)
            .post('/api/users/')
            .send({ user: testUser })
            .expect(200)
            .then(() => {
                expect(spy).toHaveReturned();
                expect(loggerSpy).toHaveBeenCalledWith('Error::SequelizeUniqueConstraintError: Validation error');
            });
    });

    test('get user by email', async () => {
        const spy = jest.spyOn(userRepository, 'getUserByEmail');

        await request(app)
            .get(`/api/users/verify/${testUser.email}/${testUser.password}/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body.passwordsMatch).toBeTruthy();
                expect(res.body.userExists).toBeTruthy();
                expect(res.body.user.username).toBe(testUser.username);
            });
    });

    test('check email exists', async () => {
        const spy = jest.spyOn(userRepository, 'getUserByEmail');

        await request(app)
            .get(`/api/users/exists/email/${testUser.email}/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body.emailExists).toBeTruthy();
            });

        await request(app)
            .get('/api/users/exists/email/notAUser@gmail.com/')
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturnedTimes(2);
                expect(res.body.emailExists).toBeFalsy();
            });
    });

    test('check username exists', async () => {
        const spy = jest.spyOn(userRepository, 'getUserByUsername');

        await request(app)
            .get(`/api/users/exists/username/${testUser.username}/`)
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body.usernameExists).toBeTruthy();
            });

        await request(app)
            .get('/api/users/exists/username/notAUser/')
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturnedTimes(2);
                expect(res.body.usernameExists).toBeFalsy();
            });
    });
});
