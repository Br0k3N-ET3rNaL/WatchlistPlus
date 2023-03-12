import { createBoard } from '@wixc3/react-board';
import { App } from '../../../App';

export default createBoard({
    name: 'App',
    Board: () => <App />,
    environmentProps: {
        canvasHeight: 682,
        canvasWidth: 1291,
    },
});
