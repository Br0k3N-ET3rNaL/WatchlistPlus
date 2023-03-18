import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Review } from '../App';
import UserContext, { User } from '../context';
import ReviewListElement from '../components/review-list-element/review-list-element';
import ReviewView from '../components/review-view/review-view';
import CreateReview from '../components/create-review/create-review';

const testUser: User = { id: 1, username: 'TestUser' };
const testReview: Review = { username: testUser.username, review: 'Test review', titleId: 'testId', userId: testUser.id };

describe('review-list-element', () => {
    test('display review', async () => {
        render(
            <ReviewListElement review={testReview} />
        );

        expect(screen.getByText(testReview.username)).toBeDefined();
        expect(screen.getByText(testReview.review)).toBeDefined();
    });
});

describe('review-view', () => {
    let fetchMock: jest.Mock<any, any, any>;

    beforeAll(() => {
        global.scrollTo = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve() })
        ) as jest.Mock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([testReview]) })
        ) as jest.Mock;
    });

    test('display no reviews', async () => {
        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([]) })
        ) as jest.Mock;

        render(
            <UserContext.Provider value={testUser}>
                <ReviewView titleId={testReview.titleId} />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(screen.queryByText('No reviews yet')!.hidden).toBeFalsy();
    });

    test('display reviews', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <ReviewView titleId={testReview.titleId} />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/reviews/' + testReview.titleId + '/50/1/');
        expect(fetchMock.mock.lastCall[1].method).toBe('GET');

        expect(await screen.findByText(testReview.username)).toBeDefined();
        expect(screen.getByText(testReview.review)).toBeDefined();
        expect(screen.getByText('No reviews yet').hidden).toBeTruthy();
    });

    test('close reviews', async () => {
        const closeReviews = jest.fn();

        render(
            <UserContext.Provider value={testUser}>
                <ReviewView titleId={testReview.titleId} closeReviews={closeReviews} />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        await userEvent.click(screen.getByText('Go Back'));
        expect(closeReviews).toHaveBeenCalled();
    });
});

describe('create-review', () => {
    test('create review', async () => {
        const fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve() })
        ) as jest.Mock;

        render(
            <UserContext.Provider value={testUser}>
                <CreateReview title={'Test Title'} titleId={'testId'} />
            </UserContext.Provider>
        );

        await userEvent.type(screen.getByRole('textbox'), testReview.review);
        await userEvent.click(screen.getByText('Submit'));
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/reviews/');
        expect(fetchMock.mock.lastCall[1].method).toBe('POST');
        expect(fetchMock.mock.lastCall[1].body).toContain(JSON.stringify(testReview));
    });

    test('close create review', async () => {
        const closeCreate = jest.fn();
        
        render(
            <UserContext.Provider value={testUser}>
                <CreateReview title={'Test Title'} titleId={'testId'} closeCreate={closeCreate}/>
            </UserContext.Provider>
        );

        await userEvent.click(screen.getByText('Cancel'));
        await userEvent.click(screen.getByText('X'));
        await waitFor(() => expect(closeCreate).toHaveBeenCalledTimes(2));
    });
});