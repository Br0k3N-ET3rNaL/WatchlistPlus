import styles from './review-list-element.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Review } from '../../App';

type ReviewListElementProps = {
    className?: string;
    children?: React.ReactNode;
    review: Review;
};

class ReviewListElement extends React.Component<ReviewListElementProps> {
    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.props.children}
                <span className={styles.titleBar}>
                    <h2 className={styles.username}>{this.props.review.username}</h2>
                </span>
                <p className={styles.review}> {this.props.review.review} </p>
            </div>
        );
    }
}

export default ReviewListElement;
