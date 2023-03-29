import classNames from 'classnames';
import React, { ReactElement } from 'react';
import styles from './title-view.module.scss';
import { Title } from '../../interfaces';
import ReviewView from '../review-view/review-view';
import CreateReview from '../create-review/create-review';
import RecommendationView from '../recommendation-view/recommendation-view';
import CreateRecommendation from '../create-recommendation/create-recommendation';

type TitleViewProps = {
    className?: string;
    children?: React.ReactNode;
    title: Title;
    loggedIn: boolean;
    closeTitle?: () => void;
};

type TitleViewState = {
    genres?: React.ReactNode;
    reviewView?: ReactElement<ReviewView>;
    createReview?: ReactElement<CreateReview>;
    recommendationView?: ReactElement<RecommendationView>;
    createRecommendation?: ReactElement<CreateRecommendation>;
}

class TitleView extends React.Component<TitleViewProps, TitleViewState> {
    constructor(props: TitleViewProps | Readonly<TitleViewProps>) {
        super(props);

        this.state = {};
    }

    componentDidMount(): void {
        const { props } = this;

        this.setState({
            genres: props.title.genres.map((genre: string) => <li key={genre} className={styles.genres}> {genre.replace(/'/g, '')} </li>),
        });
    }

    handleViewReviews: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const { props } = this;

        this.setState({
            reviewView: <ReviewView titleId={props.title.id} closeReviews={this.closeReviewView} />
        });
    }

    handleCreateReviews: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const { props } = this;

        this.setState({
            createReview: <CreateReview titleId={props.title.id} title={props.title.title} closeCreate={this.closeCreateReview} />
        });
    }

    closeReviewView = () => {
        this.setState({
            reviewView: undefined,
        });
    }

    closeCreateReview = () => {
        this.setState({
            createReview: undefined,
        });
    }

    handleViewRecommendations: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const { props } = this;

        this.setState({
            recommendationView: <RecommendationView titleId={props.title.id} closeRecommendations={this.closeRecommendationsView} />
        });
    }

    handleCreateRecommendation: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const { props } = this;

        this.setState({
            createRecommendation: <CreateRecommendation titleId={props.title.id} title={props.title.title} closeCreate={this.closeCreateRecommendation} />,
        });
    }

    closeRecommendationsView = () => {
        this.setState({
            recommendationView: undefined,
        });
    }

    closeCreateRecommendation = () => {
        this.setState({
            createRecommendation: undefined,
        });
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>{props.children}
                {state.reviewView}
                {state.createReview}
                {state.recommendationView}
                {state.createRecommendation}
                {(state.reviewView === undefined && state.createReview === undefined && state.recommendationView === undefined && state.createRecommendation === undefined) && <div className={styles.mainView}>
                    <div className={styles.title}>
                        {props.title.title}
                        <button type="button" aria-label="close" className={styles.closeButton} onClick={props.closeTitle}>
                            X
                        </button>
                    </div>
                    <div className={styles.infoBar}>
                        <div className={styles.infoBarElement}> {props.title.type} </div>
                        <div className={styles.infoBarElement}>{props.title.releaseYear}</div>
                        <div className={styles.infoBarElement}>{props.title.ageGuidance}</div>
                        <div className={styles.infoBarElement}> {props.title.runtime}mins </div>
                    </div>
                    <div className={styles.infoBar}>
                        <ul className={styles.genreList}>
                            {state.genres}
                        </ul>
                    </div>
                    <div className={styles.description}>{props.title.description}</div>
                    <div className={styles.bottomBar}>
                        <span>
                            <button type="button" onClick={this.handleViewReviews}> View Reviews </button>
                            <button type="button" onClick={this.handleViewRecommendations}> View Recommendations </button>
                        </span>
                        {props.loggedIn && <span>
                            <button type="button" onClick={this.handleCreateReviews}> Leave a Review </button>
                            <button type="button" onClick={this.handleCreateRecommendation}> Recommend Another Title </button>
                        </span>}
                    </div>
                </div>}
            </div>
        );
    }
}

export default TitleView;
