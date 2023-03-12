import { createBoard } from '@wixc3/react-board';
import TitleView from '../../../components/title-view/title-view';

const testTitle = {id: '', title: 'Title', type: 'Movie', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller']};

export default createBoard({
    name: 'TitleView',
    Board: () => <TitleView title={testTitle}/>,
    environmentProps: {
        canvasHeight: 887,
        canvasWidth: 1508,
    },
});
