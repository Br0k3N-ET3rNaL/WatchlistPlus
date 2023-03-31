import classNames from 'classnames';
import React, { ReactElement } from 'react';
import styles from './recommendation-view.module.scss';
import RecommendationListElement from '../recommendation-list-element/recommendation-list-element';
import { Recommendations } from '../../interfaces';
import PageController from '../page-controller/page-controller';

type RecommendationViewProps = {
    className?: string;
    children?: React.ReactNode;
    titleId: string;
    closeRecommendations?: () => void;
}

type RecommendationViewState = {
    listItems?: ReactElement<typeof RecommendationListElement>[];
    page: number;
}

class RecommendationView extends React.Component<RecommendationViewProps, RecommendationViewState> {
    constructor(props: RecommendationViewProps | Readonly<RecommendationViewProps>) {
        super(props);

        this.state = {
            page: 1,
        }
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
        fetch(`/api/recommendations/${props.titleId}/50/${state.page}/`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map((recommendation: Recommendations, index: number) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <RecommendationListElement key={index} recommendation={recommendation} />
                    )),
                });
            });

        window.scrollTo(0, 0);
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>{props.children}
                <div className={styles.view}>
                    <ul className={styles.unorderedList}>
                        {(state.listItems?.length === 0 && state.page === 0) && <span> No recommendations yet </span>}
                        {(state.listItems?.length === 0 && state.page > 0) && <span> No more recommendations </span>}
                        {state.listItems}
                    </ul>
                    <div className={styles.bottomBar}>
                        {(state.listItems?.length !== 0 || state.page > 0) && <PageController
                            page={state.page}
                            onNextPage={this.handleNextPage}
                            onPrevPage={this.handlePrevPage}
                            onFirstPage={this.handleFirstPage}
                        />}
                        <button type="button" className={styles.closeButton} onClick={props.closeRecommendations}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

};

export default RecommendationView;
