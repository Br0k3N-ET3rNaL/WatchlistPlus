import styles from './browse-view.module.scss';
import classNames from 'classnames';
import React from 'react';
import TitleListElement from '../title-list-element/title-list-element';

type BrowseViewProps = {
    className?: string;
    children?: React.ReactNode;
    loggedIn: boolean;
};

type BrowseViewState = {
    listItems: any;
    sortOptions: any;
    sortColumn: string;
    page: number;
};

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-browse-views-and-templates
 */
class BrowseView extends React.Component<BrowseViewProps, BrowseViewState> {
    state: BrowseViewState = {
        listItems: undefined,
        sortOptions: undefined,
        sortColumn: 'tmdbPopularity',
        page: 1,
    };

    componentDidMount(): void {
        const sortColumns = [
            { key: 'Popularity', column: 'tmdbPopularity' },
            { key: 'Rating', column: 'imdbScore' },
            { key: 'Release Year', column: 'releaseYear' },
        ];

        this.setState({
            sortOptions: sortColumns.map(({ key, column }) => (
                <option key={key} value={column}>
                    {key}
                </option>
            )),
        }, this.getCurrentPage);
    }

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
        fetch('/api/titles/50/' + this.state.page + '/' + this.state.sortColumn, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    listItems: data.map(
                        (title: { title: string; releaseYear: number; rating: number }) => (
                            <TitleListElement key={items++} title={title} loggedIn={this.props.loggedIn} />
                        )
                    ),
                });
            });

        window.scrollTo(0, 0);
    }

    // pass in logged in to toggle check button
    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div className={styles.browseList}>
                    <ul>
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
                        <div className={styles.pageButtons}>
                            <button
                                onClick={this.handleFirstPage}
                                className={styles.pageButton}
                                disabled={this.state.page <= 2}
                            >
                                &lt;&lt;
                            </button>
                            <button
                                onClick={this.handlePrevPage}
                                className={styles.pageButton}
                                disabled={this.state.page === 1}
                            >
                                &lt;
                            </button>
                            <div className={styles.pageButton}>{this.state.page}</div>
                            <button
                                onClick={this.handleNextPage}
                                className={styles.pageButton}
                                disabled={false}
                            >
                                &gt;
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.listSortOptions}>
                    Sort By
                    <select onChange={this.handleDropdownChange}>{this.state.sortOptions}</select>
                </div>
            </div>
        );
    }
}

export default BrowseView;
