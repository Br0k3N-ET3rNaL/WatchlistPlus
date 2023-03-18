const request = require('supertest');
const app = require('../server');
const userRepository = require('../repository/user.repository');

describe('user', () => {
    const testUser = { email: 'test@gmail.com', username: 'TestUser', password: 'password' };

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
});
