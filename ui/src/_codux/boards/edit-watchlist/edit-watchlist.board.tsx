import { createBoard } from '@wixc3/react-board';
import EditWatchlist from '../../../components/edit-watchlist/edit-watchlist';

const testTitle = {id: '', title: 'Title', type: 'Movie', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller']};

export default createBoard({
    name: 'EditWatchlist',
    Board: () => <EditWatchlist title={testTitle}/>
});
