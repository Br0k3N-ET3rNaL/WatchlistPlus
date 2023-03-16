import styles from './recommendation-list-element.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Recommendations } from '../../App';

type RecommendationListElementProps = {
    className?: string;
    children?: React.ReactNode;
    recommendation: Recommendations;
}

class RecommendationListElement extends React.Component<RecommendationListElementProps> {
    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                <span> {this.props.recommendation.title2Title} </span>
                <span> recommended by {this.props.recommendation.count} users </span>
            </div>
        );
    }

};

export default RecommendationListElement;
