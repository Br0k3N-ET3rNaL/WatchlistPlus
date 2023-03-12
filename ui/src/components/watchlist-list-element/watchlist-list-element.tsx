import styles from './watchlist-list-element.module.scss';
import classNames from 'classnames';
import React from 'react';

type WatchlistListElementProps = {
    className?: string;
    children?: React.ReactNode;
    key: number;
    watched: {rating: number, status: string, title: { title: string, type: string, description: string, releaseYear: number, ageGuidance: string, runtime: number, rating: number, genres: string[] }};
    displayTitle?: (title: { title: string, type: string, description: string, releaseYear: number, ageGuidance: string, runtime: number, rating: number, genres: string[] }) => void;
}

class WatchlistListElement extends React.Component<WatchlistListElementProps> {
    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                <div />
                <div className={styles.title} onClick={() => {
                    if (this.props.displayTitle !== undefined)
                        this.props.displayTitle(this.props.watched.title)
                }}> {this.props.watched.title.title} </div>
                <div> {this.props.watched.status} </div>
                <div> {this.props.watched.title.releaseYear} </div>
                <div> {this.props.watched.rating} </div>
            </div>
        );
    }

};

export default WatchlistListElement;
