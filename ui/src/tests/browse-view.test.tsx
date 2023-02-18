import BrowseView from '../components/browse-view/browse-view';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const stubTitle = { title: 'Title', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };

test('browse change order', async () => {
    const mock = global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve([stubTitle, stubTitle]) })
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
        Promise.resolve({ json: async () => Promise.resolve([stubTitle, stubTitle]) })
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
        Promise.resolve({ json: async () => Promise.resolve([stubTitle, stubTitle]) })
    ) as jest.Mock;

    render(<BrowseView loggedIn={false} />);

    await userEvent.type(screen.getByRole('textbox'), 'search');

    setTimeout(() => {
        expect(mock.mock.calls).toHaveLength(2);
        expect(mock.mock.calls).lastCalledWith('/api/titles/50/1/tmdbPopularity/search');
    }, 1000);
});

test('browse combination', async () => {
    const mock = global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve([stubTitle, stubTitle]) })
    ) as jest.Mock;

    const mockScroll = global.scrollTo = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve() })
    ) as jest.Mock;

    render(<BrowseView loggedIn={false} />);

    await userEvent.selectOptions(screen.getByRole('combobox'), 'imdbScore');
    await userEvent.click(screen.getByRole('button', { name: /next/i }));
    await userEvent.type(screen.getByRole('textbox'), 'search');

    setTimeout(() => {
        expect(mock.mock.calls).toHaveLength(4);
        expect(mockScroll.mock.calls).toHaveLength(4);
        expect(mock.mock.calls).lastCalledWith('/api/titles/50/2/imdbScore/search');
    }, 1000);
});
