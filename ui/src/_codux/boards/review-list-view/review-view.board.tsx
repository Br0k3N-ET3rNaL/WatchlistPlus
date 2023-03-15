import { createBoard } from '@wixc3/react-board';
import ReviewView from '../../../components/review-view/review-view';

const tid = 'tm1143265';

export default createBoard({
    name: 'ReviewView',
    Board: () => <ReviewView titleId={tid} />,
    environmentProps: {
        canvasHeight: 731,
        canvasWidth: 1320,
    },
});
