import styles from './review-view.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Review } from '../../App';
import ReviewListElement from '../review-list-element/review-list-element';
import PageController from '../page-controller/page-controller';

type ReviewViewProps = {
    className?: string;
    children?: React.ReactNode;
    titleId: string;
    closeReviews?: () => void;
};

type ReviewViewState = {
    listItems: any;
    page: number;
};

class ReviewView extends React.Component<ReviewViewProps, ReviewViewState> {
    state: ReviewViewState = {
        listItems: undefined,
        page: 1,
    };

    componentDidMount(): void {
        this.getCurrentPage();
    }

    handleNextPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.setState({ page: this.state.page + 1 }, this.getCurrentPage);
    };

    handlePrevPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.setState({ page: this.state.page - 1 }, this.getCurrentPage);
    };

    handleFirstPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.setState({ page: 1 }, this.getCurrentPage);
    };

    getCurrentPage() {
        var items = 0;
        const requestOptions = {
            method: 'GET',
        };
        fetch('/api/reviews/' + this.props.titleId + '/50/' + this.state.page + '/', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map((review: Review) => (
                        <ReviewListElement key={items++} review={review} />
                    )),
                });
            });

        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.props.children}
                <div className={styles.view}>
                    <ul className={styles.unorderedList}>
                        {this.state.listItems?.length === 0 && <span> No reviews yet </span>}
                        {this.state.listItems}
                    </ul>
                    <div className={styles.bottomBar}>
                        {this.state.listItems?.length !== 0 && <PageController
                            page={this.state.page}
                            onNextPage={this.handleNextPage}
                            onPrevPage={this.handlePrevPage}
                            onFirstPage={this.handleFirstPage}
                        />}
                        <button className={styles.closeButton} onClick={this.props.closeReviews}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReviewView;
