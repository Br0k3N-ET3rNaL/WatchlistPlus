import styles from './watchlist.module.scss';
import classNames from 'classnames';
import React from 'react';
import WatchlistListElement from '../watchlist-list-element/watchlist-list-element';
import PageController from '../page-controller/page-controller';

type WatchlistProps = {
    className?: string;
    children?: React.ReactNode;
}

type WatchlistState = {
    listItems: any;
    page: number;
}

class Watchlist extends React.Component<WatchlistProps, WatchlistState> {
    state: WatchlistState = {
        listItems: undefined,
        page: 1,
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

    getCurrentPage() {};

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                <div className={styles.watchlist}>
                    <div className={styles.watchlistList}>
                        <ul className={styles.unorderedList}>
                            <div className={styles.listTitleBar}>
                                <div />
                                <div>Title</div>
                                <div>Status</div>
                                <div>Year</div>
                                <div>Rating</div>
                            </div>
                            {this.state.listItems}
                        </ul>
                        <div className={styles.bottomBar}>
                            <PageController page={this.state.page} onNextPage={this.handleNextPage} onPrevPage={this.handlePrevPage} onFirstPage={this.handleFirstPage} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

};

export default Watchlist;
