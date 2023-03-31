import classNames from 'classnames';
import React, { ReactElement } from 'react';
import styles from './review-view.module.scss';
import { Review } from '../../interfaces';
import ReviewListElement from '../review-list-element/review-list-element';
import PageController from '../page-controller/page-controller';

type ReviewViewProps = {
    className?: string;
    children?: React.ReactNode;
    titleId: string;
    closeReviews?: () => void;
};

type ReviewViewState = {
    listItems?: ReactElement<typeof ReviewListElement>[];
    page: number;
};

class ReviewView extends React.Component<ReviewViewProps, ReviewViewState> {
    constructor(props: ReviewViewProps | Readonly<ReviewViewProps>) {
        super(props);

        this.state = {
            listItems: undefined,
            page: 1,
        };
    }

    componentDidMount(): void {
        this.getCurrentPage();
    }

    handleNextPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.setState(prevState => ({ page: prevState.page + 1 }), this.getCurrentPage);
    };

    handlePrevPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.setState(prevState => ({ page: prevState.page - 1 }), this.getCurrentPage);
    };

    handleFirstPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.setState({ page: 1 }, this.getCurrentPage);
    };

    getCurrentPage() {
        const { props, state } = this;

        const requestOptions = {
            method: 'GET',
        };
        fetch(`/api/reviews/${props.titleId}/50/${state.page}/`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map((review: Review, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <ReviewListElement key={index} review={review} />
                    )),
                });
            });

        window.scrollTo(0, 0);
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>
                {props.children}
                <div className={styles.view}>
                    <ul className={styles.unorderedList}>
                        <span hidden={(state.listItems && state.listItems.length > 0) || state.page > 1}> No reviews yet </span>
                        <span hidden={(state.listItems && state.listItems.length > 0) || state.page === 1}> No more reviews </span>
                        {state.listItems}
                    </ul>
                    <div className={styles.bottomBar}>
                        {(state.listItems?.length !== 0 || state.page > 1) && <PageController
                            page={state.page}
                            onNextPage={this.handleNextPage}
                            onPrevPage={this.handlePrevPage}
                            onFirstPage={this.handleFirstPage}
                        />}
                        <button type="button" className={styles.closeButton} onClick={props.closeReviews}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ReviewView;
