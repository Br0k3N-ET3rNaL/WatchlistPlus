import { createBoard } from '@wixc3/react-board';
import ReviewListElement from '../../../components/review-list-element/review-list-element';

const testReview = { username: 'Username', review: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent maximus justo sapien, vehicula varius lorem interdum sit amet. Fusce at semper ligula. Donec gravida varius pulvinar. Nulla blandit magna odio, a laoreet augue dictum eu. Quisque id varius libero. Donec sit amet metus magna. Duis eleifend odio nibh, id semper tortor egestas et. Nulla eu est sit amet leo euismod imperdiet sagittis a nunc. Maecenas eu enim sed lacus bibendum pulvinar sed sit amet lacus. Etiam vitae nisl tortor. Morbi sollicitudin tincidunt placerat. ' };

export default createBoard({
    name: 'ReviewListElement',
    Board: () => <ReviewListElement review={testReview} />
});
