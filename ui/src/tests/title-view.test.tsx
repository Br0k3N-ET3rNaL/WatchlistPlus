import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TitleView from '../components/title-view/title-view'
import UserContext, { User } from '../context';
import { Title } from '../interfaces';

const stubTitle: Title = { id: 'testId', title: 'Title', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };
const testUser: User = { id: 1, username: 'TestUser' };

test('display title', async () => {
    render(<TitleView title={stubTitle} loggedIn={false} />);

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('MOVIE')).toBeDefined();
    expect(screen.getByText('Description')).toBeDefined();
    expect(screen.getByText('2023')).toBeDefined();
    expect(screen.getByText('R')).toBeDefined();
    expect(screen.getByText('120mins')).toBeDefined();
    expect(screen.getByText('drama')).toBeDefined();
    expect(screen.getByText('thriller')).toBeDefined();
});

test('close view', async () => {
    const close = jest.fn();
    render(<TitleView title={stubTitle} loggedIn={false} closeTitle={close} />);

    await userEvent.click(screen.getByRole('button', { name: /close/i }));

    expect(close.mock.calls).toHaveLength(1);
});

test('open & close review view', async () => {
    render(<TitleView title={stubTitle} loggedIn={false} />);

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve([]) })
    ) as jest.Mock;

    await userEvent.click(screen.getByText('View Reviews'));

    const backButton = await screen.findByText('Go Back');

    expect(backButton).toBeDefined();

    await userEvent.click(backButton);

    await waitFor(() => expect(screen.queryByText('Go Back')).toBeNull());
});

test('open & close create review', async () => {
    render(
        <UserContext.Provider value={testUser}>
            <TitleView title={stubTitle} loggedIn={true} />
        </UserContext.Provider>
    );

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve([]) })
    ) as jest.Mock;

    await userEvent.click(screen.getByText('Leave a Review'));

    await screen.findByText(`Write a Review for ${stubTitle.title} :`);
    
    const closeButton = await screen.findByText('X');

    expect(closeButton).toBeDefined();

    await userEvent.click(closeButton);

    await waitFor(() => expect(screen.queryByText(`Write a Review for ${stubTitle.title} :`)).toBeNull());
});

test('open & close recommendation view', async () => {
    render(<TitleView title={stubTitle} loggedIn={false} />);

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve([]) })
    ) as jest.Mock;

    await userEvent.click(screen.getByText('View Recommendations'));

    const backButton = await screen.findByText('Go Back');

    expect(backButton).toBeDefined();

    await userEvent.click(backButton);

    await waitFor(() => expect(screen.queryByText('Go Back')).toBeNull());
});

test('open & close create recommendation', async () => {
    render(
        <UserContext.Provider value={testUser}>
            <TitleView title={stubTitle} loggedIn={true} />
        </UserContext.Provider>
    );

    global.fetch = jest.fn(async () =>
        Promise.resolve({ json: async () => Promise.resolve([]) })
    ) as jest.Mock;

    await userEvent.click(screen.getByText('Recommend Another Title'));

    await screen.findByText(`Recommend Title Based On ${stubTitle.title}`);
    
    const closeButton = await screen.findByText('X');

    expect(closeButton).toBeDefined();

    await userEvent.click(closeButton);

    await waitFor(() => expect(screen.queryByText(`Recommend Title Based On ${stubTitle.title}`)).toBeNull());
});
