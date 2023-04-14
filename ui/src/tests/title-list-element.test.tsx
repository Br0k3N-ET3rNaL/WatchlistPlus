import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TitleListElement from '../components/title-list-element/title-list-element';

const stubTitle = { id: '', title: 'Title', type: 'MOVIE', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller'] };

test('list element display title', async () => {
    render(<TitleListElement key={1} title={stubTitle} loggedIn={false} />);

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('2023')).toBeDefined();
    expect(screen.getByText('8.5')).toBeDefined();
});

test('list element click title', async () => {
    const displayTitle = jest.fn();
    render(<TitleListElement key={1} title={stubTitle} loggedIn={false} displayTitle={displayTitle}/>);

    const title = screen.getByText('Title');

    await userEvent.click(title);
    expect(displayTitle.mock.calls).toHaveLength(1);

    title.focus();
    await userEvent.keyboard('{enter}');
    expect(displayTitle.mock.calls).toHaveLength(2);
});