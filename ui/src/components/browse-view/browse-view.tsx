import classNames from 'classnames';
import React, { ReactElement } from 'react';
import styles from './browse-view.module.scss';
import TitleListElement from '../title-list-element/title-list-element';
import TitleView from '../title-view/title-view';
import PageController from '../page-controller/page-controller';
import { Title } from '../../interfaces';
import EditWatchlist from '../edit-watchlist/edit-watchlist';
import UserContext, { User } from '../../context';

type BrowseViewProps = {
    className?: string;
    children?: React.ReactNode;
    loggedIn: boolean;
};

type BrowseViewState = {
    listItems?: React.ReactNode;
    sortOptions?: React.ReactNode;
    searchInput: string;
    sortColumn: string;
    page: number;
    timeout?: NodeJS.Timeout;
    titleView?: ReactElement<TitleView>;
    editView?: ReactElement<EditWatchlist>;
    user?: User;
};

class BrowseView extends React.Component<BrowseViewProps, BrowseViewState> {
    static contextType = UserContext;

    context!: React.ContextType<typeof UserContext>;

    constructor(props: BrowseViewProps | Readonly<BrowseViewProps>) {
        super(props);

        this.state = {
            searchInput: ' ',
            sortColumn: 'tmdbPopularity',
            page: 1,
        };
    }

    componentDidMount(): void {
        const sortColumns = [
            { key: 'Popularity', column: 'tmdbPopularity' },
            { key: 'Rating', column: 'imdbScore' },
            { key: 'Release Year', column: 'releaseYear' },
        ];

        this.setState(
            {
                user: this.context,
                sortOptions: sortColumns.map(({ key, column }) => (
                    <option key={key} value={column}>
                        {key}
                    </option>
                )),
            },
            this.getCurrentPage
        );
    };

    handleDropdownChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault();

        const column = e.currentTarget.value;

        this.setState({ sortColumn: column }, this.getCurrentPage);
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

    handleSearchUpdate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();

        const { state } = this;

        if (state.timeout) {
            clearTimeout(state.timeout);
        }

        let search = e.currentTarget.value

        if (search === '') search = ' ';

        this.setState({
            timeout: setTimeout(() => {
                this.setState({ searchInput: search }, this.getCurrentPage);
            }, 1000)
        })
    };

    getCurrentPage() {
        const { props, state } = this;

        const requestOptions = {
            method: 'GET',
        };
        let path: string;

        if (props.loggedIn && state.user) {
            path = `/api/titles/page/withWatched/${state.user.id}/50/${state.page}/${state.sortColumn}/${state.searchInput}/`;
        } else {
            path = `/api/titles/page/50/${state.page}/${state.sortColumn}/${state.searchInput}/`;
        }

        fetch(path, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map(
                        (title: Title) => (
                            <TitleListElement
                                key={title.id}
                                title={title}
                                loggedIn={props.loggedIn}
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
        const { props } = this;

        document.body.style.overflow = 'hidden';
        this.setState({
            titleView: <TitleView title={title} loggedIn={props.loggedIn} closeTitle={this.closeTitle} />
        });
    };

    displayEdit = (title: Title) => {
        document.body.style.overflow = 'hidden';
        this.setState({
            editView: <EditWatchlist title={title} closeEdit={this.closeEdit} />
        });
    };

    closeTitle = () => {
        document.body.style.overflow = 'unset';
        this.setState({
            titleView: undefined,
        });
    };

    closeEdit = () => {
        document.body.style.overflow = 'unset';
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
                <div className={styles.searchBar}>
                    <input className={styles.searchInput} onChange={this.handleSearchUpdate} />
                </div>
                <div className={styles.browse}>
                    <div className={styles.browseList}>
                        <ul className={styles.unorderedList}>
                            <div className={styles.listTitleBar}>
                                <div />
                                <div>Title</div>
                                <div>Year</div>
                                <div>Rating</div>
                                {props.loggedIn && <div>Add To List</div>}
                            </div>
                            {state.listItems}
                        </ul>
                        <div className={styles.bottomBar}>
                            <PageController page={state.page} onNextPage={this.handleNextPage} onPrevPage={this.handlePrevPage} onFirstPage={this.handleFirstPage} />
                        </div>
                    </div>
                    <div className={styles.listSortOptions}>
                        Sort By
                        <select onChange={this.handleDropdownChange}>
                            {state.sortOptions}
                        </select>
                    </div>
                </div>
            </div>
        );
    };
}

export default BrowseView;
