import { createBoard } from '@wixc3/react-board';
import CreateReview from '../../../components/create-review/create-review';

const tid = 'tm1143265';
const title = 'Incantation';

export default createBoard({
    name: 'CreateReview',
    Board: () => <CreateReview titleId={tid} title={title} />,
    environmentProps: {
        windowWidth: 1024,
    },
});
