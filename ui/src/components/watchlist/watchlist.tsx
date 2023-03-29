import classNames from 'classnames';
import React, { ReactElement } from 'react';
import styles from './watchlist.module.scss';
import WatchlistListElement from '../watchlist-list-element/watchlist-list-element';
import PageController from '../page-controller/page-controller';
import TitleView from '../title-view/title-view';
import { Title, Watched } from '../../interfaces';
import UserContext, { User } from '../../context';
import EditWatchlist from '../edit-watchlist/edit-watchlist';

type WatchlistProps = {
    className?: string;
    children?: React.ReactNode;
}

type WatchlistState = {
    listItems?: React.ReactNode;
    sortOptions?: React.ReactNode;
    sortColumn: string;
    page: number;
    titleView?: ReactElement<TitleView>;
    editView?: ReactElement<EditWatchlist>;
    user?: User;
    statusOptions?: React.ReactNode;
    statusFilter: string;
}

class Watchlist extends React.Component<WatchlistProps, WatchlistState> {
    static contextType = UserContext;

    context!: React.ContextType<typeof UserContext>;

    constructor(props: WatchlistProps | Readonly<WatchlistProps>) {
        super(props);

        this.state = {
            sortColumn: 'status',
            statusFilter: 'All',
            page: 1,
        };
    }

    componentDidMount(): void {
        const sortColumns = [
            { key: 'Status', column: 'status' },
            { key: 'Rating', column: 'rating' },
        ];
        const options = [
            { status: 'All' },
            { status: 'Plan To Watch' },
            { status: 'Watching' },
            { status: 'Completed' },
        ];

        this.setState({
            user: this.context,
            sortOptions: sortColumns.map(({ key, column }) => (
                <option key={key} value={column}>
                    {key}
                </option>
            )),
            statusOptions: options.map(({ status }) => (
                <option key={status} value={status}>
                    {status}
                </option>
            ))
        }, () => { this.getCurrentPage() });
    };

    handleSortChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault();

        const column = e.currentTarget.value;

        this.setState({ sortColumn: column }, this.getCurrentPage);
    };

    handleFilterChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault();

        const filter = e.currentTarget.value;

        this.setState({ statusFilter: filter }, this.getCurrentPage);
    };

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
        const { state } = this;

        const requestOptions = {
            method: 'GET',
        };
        fetch(`/api/watchlist/${state.user?.id}/50/${state.page}/${state.sortColumn}/${state.statusFilter}/`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map(
                        (watched: Watched) => (
                            <WatchlistListElement
                                key={watched.title?.id}
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
        this.setState(prevState => ({
            titleView: <TitleView title={title} loggedIn={prevState.user?.id !== undefined} closeTitle={this.closeTitle} />
        }));
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
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>{props.children}
                {state.titleView}
                {state.editView}
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
                            {state.listItems}
                        </ul>
                        <div className={styles.bottomBar}>
                            <PageController page={state.page} onNextPage={this.handleNextPage} onPrevPage={this.handlePrevPage} onFirstPage={this.handleFirstPage} />
                        </div>
                    </div>
                    <div className={styles.listSortOptions}>
                        Sort By
                        <select onChange={this.handleSortChange} aria-label="sort">
                            {state.sortOptions}
                        </select>
                    </div>
                    <div className={styles.listSortOptions}>
                        Status
                        <select onChange={this.handleFilterChange} aria-label="status">
                            {state.statusOptions}
                        </select>
                    </div>
                </div>
            </div>
        );
    };

};

export default Watchlist;
