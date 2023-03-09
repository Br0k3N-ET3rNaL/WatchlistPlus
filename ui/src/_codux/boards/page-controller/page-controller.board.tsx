import { createBoard } from '@wixc3/react-board';
import PageController from '../../../components/page-controller/page-controller';

export default createBoard({
    name: 'PageController',
    Board: () => <PageController page={1}/>
});
