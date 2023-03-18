const request = require('supertest');
const app = require('../server');
const titleRepository = require('../repository/title.repository');

describe('title', () => {
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
    });

    test('get titles', async () => {
        const spy = jest.spyOn(titleRepository, 'getPageOfTitles');

        await request(app)
            .get('/api/titles/page/50/1/tmdbScore/ /')
            .send()
            .expect(200)
            .then((res) => {
                expect(spy).toHaveReturned();
                expect(res.body).toHaveLength(50);
            });
    });
});
