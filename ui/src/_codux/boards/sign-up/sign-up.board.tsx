import { createBoard } from '@wixc3/react-board';
import { SignUp } from '../../../components/sign-up/sign-up';

export default createBoard({
    name: 'SignUp',
    Board: () => <SignUp />,
    environmentProps: {
        canvasWidth: 1112,
        canvasHeight: 777,
        windowHeight: 768,
        windowWidth: 1024,
    },
});
