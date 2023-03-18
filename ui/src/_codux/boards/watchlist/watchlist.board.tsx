import { createBoard } from '@wixc3/react-board';
import Watchlist from '../../../components/watchlist/watchlist';
import UserContext, { User } from '../../../context';

const user: User = { id: 1, username: 'Username' };

export default createBoard({
    name: 'Watchlist',
    Board: () => (
        <UserContext.Provider value={user}>
            <Watchlist />
        </UserContext.Provider >
    )
});
