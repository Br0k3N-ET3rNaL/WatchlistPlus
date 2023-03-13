import styles from './watchlist.module.scss';
import classNames from 'classnames';
import React from 'react';
import WatchlistListElement from '../watchlist-list-element/watchlist-list-element';
import PageController from '../page-controller/page-controller';
import TitleView from '../title-view/title-view';
import { Title, Watched } from '../../App';
import UserContext from '../../context';

type WatchlistProps = {
    className?: string;
    children?: React.ReactNode;
}

type WatchlistState = {
    listItems: any;
    page: number;
    titleView?: any;
    userID?: number;
}

class Watchlist extends React.Component<WatchlistProps, WatchlistState> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;

    state: WatchlistState = {
        listItems: undefined,
        page: 1,
    }

    componentDidMount(): void {
        this.setState({ userID: this.context }, () => {this.getCurrentPage()});
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
        fetch('/api/watchlist/' + this.state.userID + '/50/' + this.state.page + '/', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map(
                        (watched: Watched) => (
                            <WatchlistListElement
                                key={items++}
                                watched={watched}
                                displayTitle={this.displayTitle}
                            />
                        )
                    ),
                });
            });

        window.scrollTo(0, 0);
    };

    displayTitle = (title: Title) => {
        this.setState({
            titleView: <TitleView title={title} closeTitle={this.closeTitle} />
        });
    }

    closeTitle = () => {
        this.setState({
            titleView: undefined,
        })
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                {this.state.titleView}
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
