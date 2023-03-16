import { createBoard } from '@wixc3/react-board';
import RecommendationListElement from '../../../components/recommendation-list-element/recommendation-list-element';

const testRecommendation = { title1Id: 'tm1143265', title1Title: 'Incantation', title2Id: 'ts38796', title2Title: 'Stranger Things', count: 3 }

export default createBoard({
    name: 'RecommendationListElement',
    Board: () => <RecommendationListElement recommendation={testRecommendation} />
});
