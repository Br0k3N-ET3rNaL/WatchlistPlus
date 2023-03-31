import classNames from 'classnames';
import React from 'react';
import styles from './recommendation-list-element.module.scss';
import { Recommendations } from '../../interfaces';

type RecommendationListElementProps = {
    className?: string;
    children?: React.ReactNode;
    recommendation: Recommendations;
}

function RecommendationListElement(props: RecommendationListElementProps) {
    const { className, children, recommendation } = props;

    return (
        <div className={classNames(styles.root, className)}>{children}
            <span> {recommendation.title2Title} </span>
            <span> recommended by {recommendation.count} users </span>
        </div>
    );


};

export default RecommendationListElement;
