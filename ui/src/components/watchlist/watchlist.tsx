import styles from './watchlist.module.scss';
import classNames from 'classnames';
import React from 'react';
import WatchlistListElement from '../watchlist-list-element/watchlist-list-element';
import PageController from '../page-controller/page-controller';
import TitleView from '../title-view/title-view';
import { Title, Watched } from '../../App';
import UserContext from '../../context';
import EditWatchlist from '../edit-watchlist/edit-watchlist';

type WatchlistProps = {
    className?: string;
    children?: React.ReactNode;
}

type WatchlistState = {
    listItems: any;
    sortOptions: any;
    sortColumn: string;
    page: number;
    titleView?: any;
    editView?: any;
    userID?: number;
}

class Watchlist extends React.Component<WatchlistProps, WatchlistState> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;

    state: WatchlistState = {
        listItems: undefined,
        sortOptions: undefined,
        sortColumn: 'status',
        page: 1,
    };

    componentDidMount(): void {
        const sortColumns = [
            { key: 'Status', column: 'status'},
            { key: 'Rating', column: 'rating' },
        ];

        this.setState({
            userID: this.context,
            sortOptions: sortColumns.map(({ key, column }) => (
                <option key={key} value={column}>
                    {key}
                </option>
            )),
        }, () => { this.getCurrentPage() });
    };

    handleDropdownChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault();

        const column = e.currentTarget.value;

        this.setState({ sortColumn: column }, this.getCurrentPage);
    };

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
        fetch('/api/watchlist/' + this.state.userID + '/50/' + this.state.page + '/' + this.state.sortColumn, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map(
                        (watched: Watched) => (
                            <WatchlistListElement
                                key={items++}
                                watched={watched}
                                displayTitle={this.displayTitle}
                                displayEdit={this.displayEdit}
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
    };

    displayEdit = (watched: Watched) => {
        this.setState({
            editView: <EditWatchlist watched={watched} closeEdit={this.closeEdit} />
        });
    };

    closeTitle = () => {
        this.setState({
            titleView: undefined,
        });
    };

    closeEdit = () => {
        this.setState({
            editView: undefined,
        }, () => this.getCurrentPage());
    };

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                {this.state.titleView}
                {this.state.editView}
                <div className={styles.watchlist}>
                    <div className={styles.watchlistList}>
                        <ul className={styles.unorderedList}>
                            <div className={styles.listTitleBar}>
                                <div />
                                <div>Title</div>
                                <div>Status</div>
                                <div>Year</div>
                                <div>Rating</div>
                                <div>Edit</div>
                            </div>
                            {this.state.listItems}
                        </ul>
                        <div className={styles.bottomBar}>
                            <PageController page={this.state.page} onNextPage={this.handleNextPage} onPrevPage={this.handlePrevPage} onFirstPage={this.handleFirstPage} />
                        </div>
                    </div>
                    <div className={styles.listSortOptions}>
                        Sort By
                        <select onChange={this.handleDropdownChange}>
                            {this.state.sortOptions}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

};

export default Watchlist;
