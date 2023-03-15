import styles from './browse-view.module.scss';
import classNames from 'classnames';
import React from 'react';
import TitleListElement from '../title-list-element/title-list-element';
import TitleView from '../title-view/title-view';
import PageController from '../page-controller/page-controller';
import { Title } from '../../App';
import EditWatchlist from '../edit-watchlist/edit-watchlist';
import UserContext, { User } from '../../context';

type BrowseViewProps = {
    className?: string;
    children?: React.ReactNode;
    loggedIn: boolean;
};

type BrowseViewState = {
    listItems: any;
    sortOptions: any;
    searchInput: string;
    sortColumn: string;
    page: number;
    timeout?: any;
    titleView?: any;
    editView?: any;
    user?: User;
};

class BrowseView extends React.Component<BrowseViewProps, BrowseViewState> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;

    state: BrowseViewState = {
        listItems: undefined,
        sortOptions: undefined,
        searchInput: ' ',
        sortColumn: 'tmdbPopularity',
        page: 1,
    };

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

    handleSearchUpdate: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();

        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }

        const search = e.currentTarget.value

        this.setState({
            timeout: setTimeout(() => {
                this.setState({ searchInput: search }, this.getCurrentPage);
            }, 1000)
        })
    };

    getCurrentPage() {
        let items = 0;
        const requestOptions = {
            method: 'GET',
        };
        let path: string;

        if (this.props.loggedIn) {
            path = '/api/titles/withWatched/' + this.state.user!.id +  '/50/' + this.state.page + '/' + this.state.sortColumn + '/' + this.state.searchInput;
        } else {
            path = '/api/titles/50/' + this.state.page + '/' + this.state.sortColumn + '/' + this.state.searchInput;
        }

        fetch(path, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map(
                        (title: Title) => (
                            <TitleListElement
                                key={items++}
                                title={title}
                                loggedIn={this.props.loggedIn}
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
        document.body.style.overflow = 'hidden';
        this.setState({
            titleView: <TitleView title={title} loggedIn={this.props.loggedIn} closeTitle={this.closeTitle}/>
        });
    };

    displayEdit = (title: Title) => {
        document.body.style.overflow = 'hidden';
        this.setState({
            editView: <EditWatchlist title={title} closeEdit={this.closeEdit}/>
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
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.state.titleView}
                {this.state.editView}
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
                                {this.props.loggedIn && <div>Add To List</div>}
                            </div>
                            {this.state.listItems}
                        </ul>
                        <div className={styles.bottomBar}>
                            <PageController page={this.state.page} onNextPage={this.handleNextPage} onPrevPage={this.handlePrevPage} onFirstPage={this.handleFirstPage}/>
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
}

export default BrowseView;
