import { createBoard } from '@wixc3/react-board';
import Watchlist from '../../../components/watchlist/watchlist';

export default createBoard({
    name: 'Watchlist',
    Board: () => <Watchlist />
});
