import { createBoard } from '@wixc3/react-board';
import { BrowseView } from '../../../components/browse-view/browse-view';

export default createBoard({
    name: 'BrowseView',
    Board: () => <BrowseView />
});
