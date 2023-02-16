import { createBoard } from '@wixc3/react-board';
import BrowseView from '../../../components/browse-view/browse-view';

const testTitle1 = { title: 'Title1', year: 2023, rating: 8.5 };
const testTitle2 = { title: 'Title2', year: 1999, rating: 5.0 };

export default createBoard({
    name: 'BrowseView',
    Board: () => <BrowseView loggedIn={false} />,
    environmentProps: {
        windowWidth: 1024,
        windowHeight: 768,
    },
});
