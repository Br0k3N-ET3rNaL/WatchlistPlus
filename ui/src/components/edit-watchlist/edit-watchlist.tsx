import classNames from 'classnames';
import React from 'react';
import styles from './edit-watchlist.module.scss';
import { Title, Watched } from '../../interfaces';
import UserContext, { User } from '../../context';

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
    user?: User;
}

class EditWatchlist extends React.Component<EditWatchlistProps, EditWatchlistState> {
    static contextType = UserContext;

    context!: React.ContextType<typeof UserContext>;

    constructor(props: EditWatchlistProps | Readonly<EditWatchlistProps>) {
        super(props);

        this.state = {
            status: 'Plan To Watch',
        };
    }

    componentDidMount(): void {
        this.setState({ user: this.context });

        const { props } = this;

        if (props.watched) {
            this.setState({ status: props.watched.status, rating: props.watched.rating });
        } else if (props.title?.watched?.status) {
            this.setState({ status: props.title.watched.status, rating: props.title.watched.rating });
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

        const { props, state } = this;

        if (props.watched || props.title?.watched?.status) {
            let titleId;

            if (props.watched) {
                titleId = props.watched.title?.id;
            } else {
                titleId = props.title?.id;
            }

            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watched: {
                        rating: state.rating,
                        status: state.status,
                        titleId,
                        userId: state.user?.id,
                    }
                }),
            };
            await fetch('/api/watchlist/', requestOptions).then(() => {
                props.closeEdit?.();
            }
            );
        }
        else if (props.title) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    watched: {
                        rating: state.rating,
                        status: state.status,
                        titleId: props.title.id,
                        userId: state.user?.id,
                    }
                }),
            };
            await fetch('/api/watchlist/', requestOptions).then(() => {
                props.closeEdit?.();
            }
            );
        }
    }

    handleDelete: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const { props, state } = this;

        let titleId;

        if (props.watched) {
            titleId = props.watched.title?.id;
        } else {
            titleId = props.title?.id;
        }

        const requestOptions = {
            method: 'DELETE',
        };
        await fetch(`/api/watchlist/${state.user?.id}/${titleId}/`, requestOptions).then(() => {
            props.closeEdit?.();
        })
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>
                {props.children}
                <div className={styles.editView}>
                    <span className={styles.editElement}>
                        <label> Title: </label>
                        {props.title?.title}
                    </span>
                    <span className={styles.editElement}>
                        <label> Status: </label>
                        <select value={state.status} onChange={this.handleStatusDropdownChange} aria-label="status">
                            <option> Plan To Watch </option>
                            <option> Watching </option>
                            <option> Completed </option>
                        </select>
                    </span>
                    <span className={styles.editElement}>
                        <label> Rating: </label>
                        <select value={String(state.rating)} onChange={this.handleRatingDropdownChange} aria-label="rating">
                            <option> Select Rating </option>
                            <option> 0 </option>
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
                        <button type="button" onClick={this.handleSubmit} aria-label="submit"> Submit </button>
                        {(props.watched || props.title?.watched?.status) && <button type="button" onClick={this.handleDelete}> Delete </button>}
                        <button type="button" onClick={props.closeEdit} aria-label="cancel"> Cancel </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditWatchlist;
