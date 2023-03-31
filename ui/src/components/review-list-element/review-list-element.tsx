import classNames from 'classnames';
import React from 'react';
import styles from './review-list-element.module.scss';
import { Review } from '../../interfaces';

type ReviewListElementProps = {
    className?: string;
    children?: React.ReactNode;
    review: Review;
};

function ReviewListElement(props: ReviewListElementProps) {
    const { className, children, review } = props;

    return (
        <div className={classNames(styles.root, className)}>
            {children}
            <span className={styles.titleBar}>
                <h2 className={styles.username}>{review.username}</h2>
            </span>
            <p className={styles.review}> {review.review} </p>
        </div>
    );
}

export default ReviewListElement;
