import styles from './title-view.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Title } from '../../App';
import ReviewView from '../review-view/review-view';
import CreateReview from '../create-review/create-review';

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
            reviewView: <ReviewView titleId={this.props.title.id} closeReviews={this.closeReviewView}/>
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

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.state.reviewView}
                {this.state.createReview}
                {(this.state.reviewView === undefined && this.state.createReview === undefined) && <div className={styles.mainView}>
                    <div className={styles.title}>
                        {this.props.title.title}
                        <button className={styles.closeButton} onClick={this.props.closeTitle}>
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
                        </span>
                        {this.props.loggedIn && <span>
                            <button onClick={this.handleCreateReviews}> Leave a Review </button>
                        </span>}
                    </div>
                </div>}
            </div>
        );
    }
}

export default TitleView;
