import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BrowseView from '../components/browse-view/browse-view';
import UserContext, { User } from '../context';
import { Title, Watched } from '../interfaces';

const stubTitle1: Title = { id: 'TestId1', title: 'Test Title 1', type: 'MOVIE', description: 'Description 1', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };
const stubTitle2 = { id: 'TestId2', title: 'Test Title 2', type: 'SHOW', description: 'Description 2', releaseYear: 1999, ageGuidance: 'G', runtime: 60, rating: 7.5, genres: ['comedy', 'romance'] };
const testUser: User = { id: 1, username: 'TestUser' };
const testWatched: Watched = {rating: 0, status: 'Plan To Watch'};
const stubTitleWithWatched: Title = { id: 'TestId3', title: 'Test Title 3', type: 'MOVIE', description: 'Description 3', releaseYear: 2005, ageGuidance: 'PG', runtime: 30, rating: 6.5, genres: ['action'], watched: testWatched};

describe('browse-view', () => {
    test('browse change order', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitle1, stubTitle2]) })
        ) as jest.Mock;

        const mockScroll = global.scrollTo = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve() })
        ) as jest.Mock;

        render(<BrowseView loggedIn={false} />);

        await userEvent.selectOptions(screen.getByRole('combobox'), 'imdbScore');

        expect((screen.getByRole('option', { name: 'Rating' }) as any).selected).toBeTruthy();
        expect(mock.mock.calls).toHaveLength(2);
        expect(mockScroll.mock.calls).toHaveLength(2);
    });

    test('browse change page', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitle1, stubTitle2]) })
        ) as jest.Mock;

        const mockScroll = global.scrollTo = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve() })
        ) as jest.Mock;

        render(<BrowseView loggedIn={false} />);

        await userEvent.click(screen.getByRole('button', { name: /next/i }));

        expect(mock.mock.calls).toHaveLength(2);
        expect(screen.getByText('2')).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /prev/i }));

        expect(mock.mock.calls).toHaveLength(3);
        expect(screen.getByText('1')).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /next/i }));
        await userEvent.click(screen.getByRole('button', { name: /next/i }));

        expect(screen.getByText('3')).toBeDefined();

        await userEvent.click(screen.getByRole('button', { name: /first/i }));

        expect(mock.mock.calls).toHaveLength(6);
        expect(mockScroll.mock.calls).toHaveLength(6);
        expect(screen.getByText('1')).toBeDefined();
    });

    test('search', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitle1, stubTitle2]) })
        ) as jest.Mock;

        render(<BrowseView loggedIn={false} />);

        await waitFor(() => expect(mock).toHaveReturned());

        const input = screen.getByRole('textbox') as HTMLInputElement;

        jest.useFakeTimers();
        await userEvent.type(input, 'T', { delay: null });
        act(() => jest.runOnlyPendingTimers());
        jest.useRealTimers();

        await waitFor(() => expect(mock).toHaveBeenCalledTimes(2));
        expect(mock.mock.lastCall[0]).toBe('/api/titles/page/50/1/tmdbPopularity/T/');
        expect(mock.mock.lastCall[1].method).toBe('GET');

        jest.useFakeTimers();
        await userEvent.type(input, '{backspace}', { delay: null });
        act(() => jest.runOnlyPendingTimers());
        jest.useRealTimers();

        await waitFor(() => expect(mock).toHaveBeenCalledTimes(3));
        expect(mock.mock.lastCall[0]).toBe('/api/titles/page/50/1/tmdbPopularity/ /');
        expect(mock.mock.lastCall[1].method).toBe('GET');
    });

    test('browse combination', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitle1, stubTitle2]) })
        ) as jest.Mock;

        render(<BrowseView loggedIn={false} />);

        await waitFor(() => expect(mock).toHaveReturned());

        jest.useFakeTimers();
        await userEvent.type(screen.getByRole('textbox'), 'search', { delay: null });
        act(() => jest.runOnlyPendingTimers());
        jest.useRealTimers();

        await userEvent.selectOptions(screen.getByRole('combobox'), 'imdbScore');
        await userEvent.click(screen.getByRole('button', { name: /next/i }));

        expect(mock).toHaveBeenCalledTimes(4);
        expect(mock.mock.lastCall[0]).toBe('/api/titles/page/50/2/imdbScore/search/');
        expect(mock.mock.lastCall[1].method).toBe('GET');
    });

    test('open & close title', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitle1]) })
        ) as jest.Mock;

        render(<BrowseView loggedIn={false} />);

        await waitFor(() => expect(mock).toHaveReturned());
        const title = await screen.findByText(stubTitle1.title);

        await userEvent.click(title);

        expect(await screen.findByText(stubTitle1.description)).toBeDefined();

        await userEvent.click(screen.getByText('X'));

        await waitFor(() => expect(screen.queryByText(stubTitle1.description)).toBeNull());
    });

    test('open & close edit', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitle1]) })
        ) as jest.Mock;

        render(
            <UserContext.Provider value={testUser}>
                <BrowseView loggedIn={true} />
            </UserContext.Provider>
        );

        await waitFor(() => expect(mock).toHaveReturned());

        const addButton = await screen.findByText('add');

        await userEvent.click(addButton);

        expect(await screen.findByText('Status:')).toBeDefined();

        await userEvent.click(screen.getByText('Cancel'));

        await waitFor(() => expect(screen.queryByText('Status:')).toBeNull());
    });

    test('open & close edit while logged-in', async () => {
        const mock = global.fetch = jest.fn(async () =>
            Promise.resolve({ json: async () => Promise.resolve([stubTitleWithWatched]) })
        ) as jest.Mock;

        render(
            <UserContext.Provider value={testUser}>
                <BrowseView loggedIn={true} />
            </UserContext.Provider>
        );

        await waitFor(() => expect(mock).toHaveReturned());
        
        const editButton = await screen.findByText('edit');

        await userEvent.click(editButton);

        expect(await screen.findByText('Status:')).toBeDefined();

        await userEvent.click(screen.getByText('Cancel'));

        await waitFor(() => expect(screen.queryByText('Status:')).toBeNull());
    });
});

