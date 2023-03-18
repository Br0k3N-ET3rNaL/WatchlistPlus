/* eslint-disable testing-library/no-debugging-utils */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Recommendation, Recommendations } from '../App';
import CreateRecommendation from '../components/create-recommendation/create-recommendation';
import RecommendationListElement from '../components/recommendation-list-element/recommendation-list-element';
import RecommendationView from '../components/recommendation-view/recommendation-view';
import UserContext, { User } from '../context';

const testUser: User = { id: 1, username: 'TestUser' };
const testRecommendations: Recommendations = { title1Id: 'test1Id', title2Id: 'test2Id', title1Title: 'Test Title 1', title2Title: 'Test Title 2', count: 3 };
const testRecommendation: Recommendation = { title1Id: testRecommendations.title1Id, title2Id: testRecommendations.title2Id, userId: testUser.id };

describe('recommendation-list-element', () => {
    test('display recommendation', async () => {
        render(
            <RecommendationListElement recommendation={testRecommendations} />
        );

        expect(screen.getByText(testRecommendations.title2Title)).toBeDefined();
        expect(screen.getByText('recommended by ' + testRecommendations.count.toString() + ' users')).toBeDefined();
    });
});

describe('recommendation-view', () => {
    let fetchMock: jest.Mock<any, any, any>;

    beforeAll(() => {
        global.scrollTo = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve() })
        ) as jest.Mock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([testRecommendations]) })
        ) as jest.Mock;
    });

    test('display recommendations', async () => {
        render(<RecommendationView titleId={testRecommendations.title1Id} />);

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/recommendations/' + testRecommendations.title1Id + '/50/1/');
        expect(fetchMock.mock.lastCall[1].method).toBe('GET');

        expect(await screen.findByText(testRecommendations.title2Title)).toBeDefined();
        expect(screen.getByText('recommended by ' + testRecommendations.count.toString() + ' users')).toBeDefined();
    });

    test('close recommendations', async () => {
        const closeRecommendations = jest.fn();

        render(<RecommendationView titleId={testRecommendations.title1Id} closeRecommendations={closeRecommendations} />);

        await userEvent.click(screen.getByText('Go Back'));
        await waitFor(() => expect(closeRecommendations).toHaveBeenCalled());
    });
});

describe('create-recommendation', () => {
    let fetchMock: jest.Mock<any, any, any>;
    let closeCreate: jest.Mock<any, any, any> | (() => void) | undefined;

    beforeAll(() => {
        closeCreate = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('create recommendation', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <CreateRecommendation titleId={testRecommendations.title1Id} title={testRecommendations.title1Title} closeCreate={closeCreate} />
            </UserContext.Provider>
        );

        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ exists: true, duplicates: false, id: testRecommendations.title2Id }) })
        ) as jest.Mock;

        await userEvent.type(screen.getByRole('textbox', { name: /title/i }), testRecommendations.title2Title + '{enter}');

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.calls[0][0]).toBe('/api/titles/verify/' + testRecommendations.title2Title + '/');
        expect(fetchMock.mock.calls[0][1].method).toBe('GET');

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(fetchMock.mock.lastCall[0]).toBe('/api/recommendations/');
        expect(fetchMock.mock.lastCall[1].method).toBe('POST');
        expect(fetchMock.mock.lastCall[1].body).toContain(JSON.stringify(testRecommendation));

        await waitFor(() => expect(closeCreate).toHaveBeenCalled());
    });

    test('create recommendation with non-unique title', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <CreateRecommendation titleId={testRecommendations.title1Id} title={testRecommendations.title1Title} closeCreate={closeCreate} />
            </UserContext.Provider>
        );

        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ exists: true, duplicates: true, id: testRecommendations.title2Id }) })
        ) as jest.Mock;

        await userEvent.type(screen.getByRole('textbox', {name: /title/i}), testRecommendations.title2Title + '{enter}');

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.calls[0][0]).toBe('/api/titles/verify/' + testRecommendations.title2Title + '/');
        expect(fetchMock.mock.calls[0][1].method).toBe('GET');

        await waitFor(() => expect(screen.queryByText('Duplicate titles, please enter extra info')!.hidden).toBeFalsy());  

        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({ exists: true, duplicates: false, id: testRecommendations.title2Id }) })
        ) as jest.Mock;

        expect(await screen.findByRole('textbox', {name: /type/i})).toBeDefined();
        await userEvent.type(screen.getByRole('textbox', {name: /type/i}), 'Movie{enter}');
        await userEvent.type(screen.getByRole('textbox', {name: /year/i}), '2023{enter}');
        
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.calls[0][0]).toBe('/api/titles/verify/' + testRecommendations.title2Title + '/Movie/2023/');
        expect(fetchMock.mock.calls[0][1].method).toBe('GET');

        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(fetchMock.mock.lastCall[0]).toBe('/api/recommendations/');
        expect(fetchMock.mock.lastCall[1].method).toBe('POST');
        expect(fetchMock.mock.lastCall[1].body).toContain(JSON.stringify(testRecommendation));

        await waitFor(() => expect(closeCreate).toHaveBeenCalled());
    });

    test('close create recommendation', async () => {
        render(<CreateRecommendation titleId={testRecommendations.title1Id} title={testRecommendations.title1Title} closeCreate={closeCreate} />);

        await userEvent.click(screen.getByText('Cancel'));
        await userEvent.click(screen.getByText('X'));

        expect(closeCreate).toHaveBeenCalledTimes(2);
    });
});