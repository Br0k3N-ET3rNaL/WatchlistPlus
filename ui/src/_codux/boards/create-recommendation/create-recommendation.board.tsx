import { createBoard } from '@wixc3/react-board';
import CreateRecommendation from '../../../components/create-recommendation/create-recommendation';

const tid = 'tm1143265';
const title = 'Incantation';

export default createBoard({
    name: 'CreateRecommendation',
    Board: () => <CreateRecommendation titleId={tid} title={title} />,
    environmentProps: {
        canvasHeight: 640,
        canvasWidth: 1402,
    },
});
