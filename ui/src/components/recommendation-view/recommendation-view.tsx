import styles from './recommendation-view.module.scss';
import classNames from 'classnames';
import React from 'react';
import RecommendationListElement from '../recommendation-list-element/recommendation-list-element';
import { Recommendations } from '../../App';
import PageController from '../page-controller/page-controller';

type RecommendationViewProps = {
    className?: string;
    children?: React.ReactNode;
    titleId: string;
    closeRecommendations?: () => void;
}

type RecommendationViewState = {
    listItems: any;
    page: number;
}

class RecommendationView extends React.Component<RecommendationViewProps, RecommendationViewState> {
    state: RecommendationViewState = {
        listItems: undefined,
        page: 1,
    }

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
        fetch('/api/recommendations/' + this.props.titleId + '/50/' + this.state.page + '/', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map((recommendation: Recommendations) => (
                        <RecommendationListElement key={items++} recommendation={recommendation} />
                    )),
                });
            });

        window.scrollTo(0, 0);
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                <div className={styles.view}>
                    <ul className={styles.unorderedList}>
                        {this.state.listItems?.length === 0 && <span> No recommendations yet </span>}
                        {this.state.listItems}
                    </ul>
                    <div className={styles.bottomBar}>
                        {this.state.listItems?.length !== 0 && <PageController
                            page={this.state.page}
                            onNextPage={this.handleNextPage}
                            onPrevPage={this.handlePrevPage}
                            onFirstPage={this.handleFirstPage}
                        />}
                        <button className={styles.closeButton} onClick={this.props.closeRecommendations}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

};

export default RecommendationView;
