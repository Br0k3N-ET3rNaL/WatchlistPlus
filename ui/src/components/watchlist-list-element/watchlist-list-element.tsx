import classNames from 'classnames';
import React from 'react';
import styles from './watchlist-list-element.module.scss';
import { Title, Watched } from '../../interfaces';

type WatchlistListElementProps = {
    className?: string;
    children?: React.ReactNode;
    watched: Watched;
    displayTitle?: (title: Title) => void;
    displayEdit?: (watched: Watched) => void;
}

function WatchlistListElement(props: WatchlistListElementProps) {
    const { className, children, watched, displayTitle, displayEdit } = props;

    return (
        <div className={classNames(styles.root, className)}>{children}
            <div />
            <div role="button" tabIndex={-1} className={styles.title}
                onClick={() => {
                    if (displayTitle !== undefined && watched.title !== undefined)
                        displayTitle(watched.title)
                }}
                onKeyDown={() => {
                    if (displayTitle !== undefined && watched.title !== undefined)
                        displayTitle(watched.title)
                }}

            > {watched.title?.title} </div>
            <div> {watched.status} </div>
            <div> {watched.title?.releaseYear} </div>
            <div> {watched.rating} </div>
            <button type="button" onClick={() => {
                if (displayEdit)
                    displayEdit(watched);
            }}> edit </button>
        </div>
    );
};

export default WatchlistListElement;
