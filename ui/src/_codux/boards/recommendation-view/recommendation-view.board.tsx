import { createBoard } from '@wixc3/react-board';
import RecommendationView from '../../../components/recommendation-view/recommendation-view';

const tid = 'tm1143265';

export default createBoard({
    name: 'RecommendationView',
    Board: () => <RecommendationView titleId={tid} />,
    environmentProps: {
        canvasHeight: 764,
        canvasWidth: 1600,
    },
});
