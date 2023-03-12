import { createBoard } from '@wixc3/react-board';
import TitleListElement from '../../../components/title-list-element/title-list-element';

const testTitle = {id: '', title: 'Title', type: 'Movie', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller']};

export default createBoard({
    name: 'TitleListElement',
    Board: () => <TitleListElement key={0} title={testTitle} loggedIn={true}/>
});
