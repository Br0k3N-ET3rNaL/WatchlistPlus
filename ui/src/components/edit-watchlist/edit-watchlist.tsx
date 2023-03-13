import styles from './edit-watchlist.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Title } from '../../App';
import UserContext from '../../context';

type EditWatchlistProps = {
    className?: string;
    children?: React.ReactNode;
    title: Title;
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
        this.setState({userID: this.context});
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
            if (this.props.closeEdit) {
                this.props.closeEdit();
            }
        }
        );
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
                            <option> Watching </option>
                            <option> Completed </option>
                        </select>
                    </span>
                    <span className={styles.editElement}>
                        <label> Rating: </label>
                        <select onChange={this.handleRatingDropdownChange}>
                            <option> Select Rating </option>
                            <option> 1 </option>
                            <option> 2 </option>
                            <option> 3 </option>
                            <option> 4 </option>
                            <option> 5 </option>
                            <option> 6 </option>
                            <option> 7 </option>
                            <option> 8 </option>
                            <option> 9 </option>
                            <option> 10 </option>
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
