import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Title, Watched } from '../interfaces';
import EditWatchlist from '../components/edit-watchlist/edit-watchlist';
import WatchlistListElement from '../components/watchlist-list-element/watchlist-list-element';
import Watchlist from '../components/watchlist/watchlist';
import UserContext, { User } from '../context';

const testUser: User = { id: 1, username: 'TestUser' };
const testTitle1: Title = { id: 'testId1', title: 'Title1', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };
const testTitle2: Title = { id: 'testId2', title: 'Title2', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };
const testTitle3: Title = { id: 'testId3', title: 'Title3', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };
const testWatched1: Watched = { rating: 10, status: 'Completed', title: testTitle1 };
const testWatched2: Watched = { rating: 0, status: 'Plan To Watch', title: testTitle2 };
const testWatched3: Watched = { rating: 0, status: 'Watching', title: testTitle3 };
const testTitleWithWatched: Title = {
    id: 'testId4', title: 'Title1', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'],
    watched: { rating: 10, status: 'Completed' }
};

describe('edit-watchlist', () => {
    let closeEdit: jest.Mock<any, any, any> | (() => void) | undefined;
    let fetchMock: jest.Mock<any, any, any>;

    beforeAll(() => {
        closeEdit = jest.fn();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve({}) })
        ) as jest.Mock;
    });

    test('add to watchlist', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <EditWatchlist title={testTitle1} closeEdit={closeEdit} />
            </UserContext.Provider>
        );

        await userEvent.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Completed');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /rating/i }), '10');

        await userEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.calls[0][0]).toBe('/api/watchlist/');
        expect(fetchMock.mock.calls[0][1].method).toBe('POST');
        expect(fetchMock.mock.calls[0][1].body).toContain(JSON.stringify({
            rating: 10, status: 'Completed', titleId: testTitle1.id, userId: testUser.id,
        }));

        await waitFor(() => expect(closeEdit).toHaveBeenCalled());
    });

    test('edit existing watched', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <EditWatchlist watched={testWatched1} closeEdit={closeEdit} />
            </UserContext.Provider>
        );

        await userEvent.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Plan To Watch');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /rating/i }), '0');

        await userEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/');
        expect(fetchMock.mock.lastCall[1].method).toBe('PUT');
        expect(fetchMock.mock.lastCall[1].body).toContain(JSON.stringify({
            rating: 0, status: 'Plan To Watch', titleId: testTitle1.id, userId: testUser.id,
        }));

        await waitFor(() => expect(closeEdit).toHaveBeenCalled());
    });

    test('edit existing watched from title', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <EditWatchlist title={testTitleWithWatched} closeEdit={closeEdit} />
            </UserContext.Provider>
        );

        await userEvent.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Plan To Watch');
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /rating/i }), '0');

        await userEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/');
        expect(fetchMock.mock.lastCall[1].method).toBe('PUT');
        expect(fetchMock.mock.lastCall[1].body).toContain(JSON.stringify({
            rating: 0, status: 'Plan To Watch', titleId: testTitleWithWatched.id, userId: testUser.id,
        }));

        await waitFor(() => expect(closeEdit).toHaveBeenCalled());
    });

    test('remove from watchlist', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <EditWatchlist watched={testWatched1} closeEdit={closeEdit} />
            </UserContext.Provider>
        );

        await userEvent.click(screen.getByText('Delete'));
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/' + testTitle1.id + '/');
        expect(fetchMock.mock.lastCall[1].method).toBe('DELETE');
    });

    test('remove from watchlist from browse-view', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <EditWatchlist title={testTitleWithWatched} closeEdit={closeEdit} />
            </UserContext.Provider>
        );

        await userEvent.click(screen.getByText('Delete'));
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/' + testTitleWithWatched.id + '/');
        expect(fetchMock.mock.lastCall[1].method).toBe('DELETE');
    });

    test('close edit', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <EditWatchlist watched={testWatched1} closeEdit={closeEdit} />
            </UserContext.Provider>
        );

        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
        await waitFor(() => expect(closeEdit).toHaveBeenCalled());
    });
});

describe('watchlist', () => {
    let fetchMock: jest.Mock<any, any, any>;

    beforeAll(() => {
        global.scrollTo = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve() })
        ) as jest.Mock;
    });

    beforeEach(() => {
        jest.clearAllMocks();
        fetchMock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([testWatched1, testWatched2, testWatched3]) })
        ) as jest.Mock;
    });

    test('display watchlist', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <Watchlist />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/50/1/status/All/');
        expect(fetchMock.mock.lastCall[1].method).toBe('GET');

        expect(await screen.findByText(testWatched1.title!.title)).toBeDefined();
        expect(within(screen.getByRole('list')).getByText(testWatched1.status)).toBeDefined();
    });

    test('switch pages', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <Watchlist />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/50/1/status/All/');
        expect(fetchMock.mock.lastCall[1].method).toBe('GET');

        expect(await screen.findByText(testWatched1.title!.title)).toBeDefined();
        expect(within(screen.getByRole('list')).getByText(testWatched1.status)).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /next/i }));

        expect(fetchMock.mock.calls).toHaveLength(2);
        expect(screen.getByText('2')).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /prev/i }));

        expect(fetchMock.mock.calls).toHaveLength(3);
        expect(screen.getByText('1')).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /next/i }));
        await userEvent.click(screen.getByRole('button', { name: /next/i }));

        expect(screen.getByText('3')).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /first/i }));

        expect(fetchMock.mock.calls).toHaveLength(6);
        expect(screen.getByText('1')).toBeDefined();
    });

    test('filter watchlist', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <Watchlist />
            </UserContext.Provider>
        );

        // Test All filter
        await waitFor(() => expect(within(screen.getByRole('list')).getAllByText('edit')).toHaveLength(3));

        // Test Plan To Watch filter
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Plan To Watch');
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/50/1/status/Plan To Watch/');

        // Test Watching filter
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Watching');
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/50/1/status/Watching/');

        // Test Completed filter
        await userEvent.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'Completed');
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(4));
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/50/1/status/Completed/');
    });

    test('sort watchlist', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <Watchlist />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveBeenCalled());

        await userEvent.selectOptions(screen.getByRole('combobox', { name: /sort/i }), 'Rating');
        await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
        expect(fetchMock.mock.lastCall[0]).toBe('/api/watchlist/' + testUser.id + '/50/1/rating/All/');
    });

    test('open & close title', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <Watchlist />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveReturned());
        const title = await screen.findByText(testTitle1.title);

        await userEvent.click(title);

        expect(await screen.findByText(testTitle1.description)).toBeDefined();

        await userEvent.click(screen.getByText('X'));

        await waitFor(() => expect(screen.queryByText(testTitle1.description)).toBeNull());
    });

    test('open & close edit', async () => {
        render(
            <UserContext.Provider value={testUser}>
                <Watchlist />
            </UserContext.Provider>
        );

        await waitFor(() => expect(fetchMock).toHaveReturned());

        const editButton = (await screen.findAllByText('edit'))[0];

        await userEvent.click(editButton);

        expect(await screen.findByText('Status:')).toBeDefined();

        await userEvent.click(screen.getByText('Cancel'));

        await waitFor(() => expect(screen.queryByText('Status:')).toBeNull());
    });
});

describe('watchlist-list-element', () => {
    test('display watched', async () => {
        render(<WatchlistListElement key={1} watched={testWatched1} />);

        expect(await screen.findByText(testWatched1.title!.title)).toBeDefined();
        expect(screen.getByText(testWatched1.status)).toBeDefined();
        expect(screen.getByText(testWatched1.title!.releaseYear)).toBeDefined();
        expect(screen.getByText(testWatched1.rating)).toBeDefined();
    });

    test('watchlist display title and edit links', async () => {
        const displayTitle = jest.fn();
        const displayEdit = jest.fn();

        render(<WatchlistListElement key={1} watched={testWatched1} displayTitle={displayTitle} displayEdit={displayEdit} />);

        const title = screen.getByText(testWatched1.title!.title)

        await userEvent.click(title);
        expect(displayTitle).toHaveBeenCalled();

        title.focus();
        await userEvent.keyboard('{enter}');
        expect(displayTitle).toHaveBeenCalledTimes(2);

        const edit = screen.getByText('edit');

        await userEvent.click(edit);
        expect(displayEdit).toHaveBeenCalled();

        edit.focus();
        await userEvent.keyboard('{enter}');
        expect(displayEdit).toHaveBeenCalledTimes(2);
    });
});
