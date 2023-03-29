import classNames from 'classnames';
import React from 'react';
import styles from './create-review.module.scss';
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

        const { props, state } = this;

        if (state.review) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    review: {
                        username: state.user?.username,
                        review: state.review,
                        titleId: props.titleId,
                        userId: state.user?.id,
                    },
                }),
            };
            await fetch('/api/reviews/', requestOptions).then(() => {
                props.closeCreate?.();
            });
        }
    };

    render() {
        const { props } = this;

        return (
            <div className={classNames(styles.root, props.className)}>
                {props.children}
                <div className={styles.review}>
                    <span className={styles.titleBar}>
                        <h2 className={styles.title}> Write a Review for {props.title} : </h2>
                        <button type="button" className={styles.closeButton} onClick={props.closeCreate}>
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
                        <button type="button" onClick={this.handleSubmit}> Submit </button>
                        <button type="button" onClick={props.closeCreate}> Cancel </button>
                    </span>
                </div>
            </div>
        );
    }
}

export default CreateReview;
