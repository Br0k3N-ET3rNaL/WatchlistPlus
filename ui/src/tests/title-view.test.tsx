import TitleView from '../components/title-view/title-view'
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const stubTitle = { id: '', title: 'Title', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };

test('display title', async () => {
    render(<TitleView title={stubTitle} loggedIn={false}/>);

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
    render(<TitleView title={stubTitle} loggedIn={false} closeTitle={close}/>);

    await userEvent.click(screen.getByRole('button', {name: /close/i}));

    expect(close.mock.calls).toHaveLength(1);
});