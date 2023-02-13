import { createBoard } from '@wixc3/react-board';
import { LogIn } from '../../../components/log-in/log-in';

export default createBoard({
    name: 'LogIn',
    Board: () => <LogIn />
});
