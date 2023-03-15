import styles from './create-review.module.scss';
import classNames from 'classnames';
import React from 'react';
import UserContext, { User } from '../../context';

type CreateReviewProps = {
    className?: string;
    children?: React.ReactNode;
    titleId: string;
    title: string;
    closeCreate?: () => void;
};

type CreateReviewState = {
    user?: User;
    review?: string;
};

class CreateReview extends React.Component<CreateReviewProps, CreateReviewState> {
    static contextType = UserContext;
    context!: React.ContextType<typeof UserContext>;

    componentDidMount(): void {
        this.setState({ user: this.context });
    }

    handleSubmitText: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const review = data.get('review')?.toString();

        if (review) {
            this.setState({ review });
        }
    };

    handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        if (this.state.review) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    review: {
                        username: this.state.user!.username,
                        review: this.state.review,
                        titleId: this.props.titleId,
                        userId: this.state.user!.id,
                    },
                }),
            };
            await fetch('/api/reviews/', requestOptions).then(() => {
                this.props.closeCreate?.();
            });
        }
    };

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                {this.props.children}
                <div className={styles.review}>
                    <span className={styles.titleBar}>
                        <h2 className={styles.title}> Write a Review for {this.props.title} : </h2>
                        <button className={styles.closeButton} onClick={this.props.closeCreate}>
                            X
                        </button>
                    </span>
                    <form
                        onChange={this.handleSubmitText}
                        onBlur={this.handleSubmitText}
                        className={styles.inputArea}
                    >
                        <textarea name="review" className={styles.input} required />
                    </form>
                    <span className={styles.bottomBar}>
                        <button onClick={this.handleSubmit}> Submit </button>
                        <button onClick={this.props.closeCreate}> Cancel </button>
                    </span>
                </div>
            </div>
        );
    }
}

export default CreateReview;
