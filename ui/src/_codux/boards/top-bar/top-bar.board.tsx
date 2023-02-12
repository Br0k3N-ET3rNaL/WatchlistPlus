import { createBoard } from '@wixc3/react-board';
import { TopBar } from '../../../components/top-bar/top-bar';

export default createBoard({
    name: 'TopBar',
    Board: () => <TopBar />,
    environmentProps: {
        canvasWidth: 1064,
        canvasHeight: 723,
    },
});
