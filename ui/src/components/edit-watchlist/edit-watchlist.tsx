import styles from './edit-watchlist.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Title, Watched } from '../../App';
import UserContext from '../../context';

type EditWatchlistProps = {
    className?: string;
    children?: React.ReactNode;
    title?: Title;
    watched?: Watched;
    closeEdit?: () => void;
};

type EditWatchlistState = {
    status: string;
    rating?: number;
    userID?: number;
}

class EditWatchlist extends React.Component<EditWatchlistProps, EditWatchlistState> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;

    state: EditWatchlistState = {
        status: 'Plan To Watch',
    };

    componentDidMount(): void {
        this.setState({ userID: this.context });

        if (this.props.watched) {
            this.setState({status: this.props.watched.status, rating: this.props.watched.rating});
        }
    }

    handleStatusDropdownChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault();

        const status = e.currentTarget.value;

        this.setState({ status });
    };

    handleRatingDropdownChange: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        e.preventDefault();

        const rating = Number(e.currentTarget.value);

        if (typeof rating === 'number') {
            this.setState({ rating });
        }
    }

    handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        if (this.props.title) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watched: {
                        rating: this.state.rating,
                        status: this.state.status,
                        titleId: this.props.title.id,
                        userId: this.state.userID,
                    }
                }),
            };
            await fetch('/api/watchlist/', requestOptions).then(() => {
                this.props.closeEdit?.();
            }
            );
        }
        else if (this.props.watched) {
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watched: {
                        rating: this.state.rating,
                        status: this.state.status,
                        titleId: this.props.watched.title!.id,
                        userId: this.state.userID,
                    }
                }),
            };
            await fetch('/api/watchlist/', requestOptions).then(() => {
                this.props.closeEdit?.();
            }
            );
        }

    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.props.children}
                <div className={styles.editView}>
                    <span className={styles.editElement}>
                        <label> Title: </label>
                        {this.props.title?.title}
                    </span>
                    <span className={styles.editElement}>
                        <label> Status: </label>
                        <select onChange={this.handleStatusDropdownChange}>
                            <option> Plan To Watch </option>
                            <option selected={this.state.status === 'Watching'}> Watching </option>
                            <option selected={this.state.status === 'Completed'}> Completed </option>
                        </select>
                    </span>
                    <span className={styles.editElement}>
                        <label> Rating: </label>
                        <select onChange={this.handleRatingDropdownChange}>
                            <option> Select Rating </option>
                            <option selected={this.state.rating === 1}> 1 </option>
                            <option selected={this.state.rating === 2}> 2 </option>
                            <option selected={this.state.rating === 3}> 3 </option>
                            <option selected={this.state.rating === 4}> 4 </option>
                            <option selected={this.state.rating === 5}> 5 </option>
                            <option selected={this.state.rating === 6}> 6 </option>
                            <option selected={this.state.rating === 7}> 7 </option>
                            <option selected={this.state.rating === 8}> 8 </option>
                            <option selected={this.state.rating === 9}> 9 </option>
                            <option selected={this.state.rating === 10}> 10 </option>
                        </select>
                    </span>
                    <div className={styles.bottomBar}>
                        <button onClick={this.handleSubmit}> Submit </button>
                        <button onClick={this.props.closeEdit}> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditWatchlist;
