import { createBoard } from '@wixc3/react-board';
import WatchlistListElement from '../../../components/watchlist-list-element/watchlist-list-element';

const testWatched = {rating: 8, status: 'Watched', title: {id: '', title: 'Title', type: 'Movie', description: 'Description', releaseYear: 2023, ageGuidance: 'R', runtime: 120, rating: 8.5, genres: ['drama', 'thriller']}};

export default createBoard({
    name: 'WatchlistListElement',
    Board: () => <WatchlistListElement key={0} watched={testWatched}/>
});
