import styles from './title-view.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Title } from '../../App';
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
    genres: any;
    reviewView?: any;
    createReview?: any;
    recommendationView?: any;
    createRecommendation?: any;
}

class TitleView extends React.Component<TitleViewProps, TitleViewState> {
    state: TitleViewState = {
        genres: undefined,
    }

    componentDidMount(): void {
        this.setState({
            genres: this.props.title.genres.map((genre: string) => <li key={genre} className={styles.genres}> {genre.replace(/'/g, '')} </li>),
        });
    }

    handleViewReviews: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        this.setState({
            reviewView: <ReviewView titleId={this.props.title.id} closeReviews={this.closeReviewView} />
        });
    }

    handleCreateReviews: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        this.setState({
            createReview: <CreateReview titleId={this.props.title.id} title={this.props.title.title} closeCreate={this.closeCreateReview} />
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

        this.setState({
            recommendationView: <RecommendationView titleId={this.props.title.id} closeRecommendations={this.closeRecommendationsView} />
        });
    }

    handleCreateRecommendation: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        this.setState({
            createRecommendation: <CreateRecommendation titleId={this.props.title.id} title={this.props.title.title} closeCreate={this.closeCreateRecommendation}/>,
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
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.state.reviewView}
                {this.state.createReview}
                {this.state.recommendationView}
                {this.state.createRecommendation}
                {(this.state.reviewView === undefined && this.state.createReview === undefined && this.state.recommendationView === undefined && this.state.createRecommendation === undefined) && <div className={styles.mainView}>
                    <div className={styles.title}>
                        {this.props.title.title}
                        <button aria-label={'close'} className={styles.closeButton} onClick={this.props.closeTitle}>
                            X
                        </button>
                    </div>
                    <div className={styles.infoBar}>
                        <div className={styles.infoBarElement}> {this.props.title.type} </div>
                        <div className={styles.infoBarElement}>{this.props.title.releaseYear}</div>
                        <div className={styles.infoBarElement}>{this.props.title.ageGuidance}</div>
                        <div className={styles.infoBarElement}> {this.props.title.runtime}mins </div>
                    </div>
                    <div className={styles.infoBar}>
                        <ul className={styles.genreList}>
                            {this.state.genres}
                        </ul>
                    </div>
                    <div className={styles.description}>{this.props.title.description}</div>
                    <div className={styles.bottomBar}>
                        <span>
                            <button onClick={this.handleViewReviews}> View Reviews </button>
                            <button onClick={this.handleViewRecommendations}> View Recommendations </button>
                        </span>
                        {this.props.loggedIn && <span>
                            <button onClick={this.handleCreateReviews}> Leave a Review </button>
                            <button onClick={this.handleCreateRecommendation}> Recommend Another Title </button>
                        </span>}
                    </div>
                </div>}
            </div>
        );
    }
}

export default TitleView;
