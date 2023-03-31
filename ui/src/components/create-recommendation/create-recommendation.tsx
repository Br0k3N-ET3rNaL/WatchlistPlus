import classNames from 'classnames';
import React from 'react';
import styles from './create-recommendation.module.scss';
import UserContext, { User } from '../../context';

type CreateRecommendationProps = {
    className?: string;
    children?: React.ReactNode;
    titleId: string;
    title: string;
    closeCreate?: () => void;
}

type CreateRecommendationState = {
    user?: User;
    otherTitle?: string;
    otherTitleId?: string;
    exists: boolean;
    duplicates: boolean;
    checked: boolean;
    checkedDuplicate: boolean;
}

class CreateRecommendation extends React.Component<CreateRecommendationProps, CreateRecommendationState> {
    static contextType = UserContext;

    context!: React.ContextType<typeof UserContext>;

    constructor(props: CreateRecommendationProps | Readonly<CreateRecommendationProps>) {
        super(props);

        this.state = {
            exists: true,
            duplicates: false,
            checked: false,
            checkedDuplicate: false,
        };
    }

    componentDidMount(): void {
        this.setState({ user: this.context });
    }

    handleSubmitText: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const { state } = this;
        const formData = new FormData(e.currentTarget);
        const title = formData.get('title')?.toString();

        if (title && (!state.checked || !state.exists)) {
            this.setState({ otherTitle: title });
            const requestOptions = {
                method: 'GET',
            };
            fetch(`/api/titles/verify/${title}/`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({
                        exists: data.exists,
                        duplicates: data.duplicates,
                        otherTitleId: data.id,
                        checked: true,
                    }, this.createIfValid);
                })
        }
    };

    handleSubmitExtra: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const { state } = this;
        const formData = new FormData(e.currentTarget);
        const type = formData.get('type')?.toString();
        const releaseYear = Number(formData.get('year')?.toString());

        if (type && releaseYear) {

            const requestOptions = {
                method: 'GET',
            };
            fetch(`/api/titles/verify/${state.otherTitle}/${type}/${releaseYear}/`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    this.setState({
                        exists: data.exists,
                        duplicates: data.duplicates,
                        otherTitleId: data.id,
                        checkedDuplicate: true,
                    }, this.createIfValid);
                })
        }
    }

    handleSubmit: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        await this.createIfValid();
    };

    async createIfValid() {
        const { props, state } = this;

        if (state.checked && state.exists && !state.duplicates) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recommendation: {
                        title1Id: props.titleId,
                        title2Id: state.otherTitleId,
                        userId: state.user?.id,
                    }
                }),
            };
            await fetch('/api/recommendations/', requestOptions).then(() => {
                props.closeCreate?.();
            });
        }
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>{props.children}
                <span className={styles.titleBar}>
                    <h2 className={styles.title}> Recommend Title Based On {props.title} </h2>
                    <button type="button" className={styles.closeButton} onClick={props.closeCreate}> X </button>
                </span>
                <div className={styles.bottomBar}>
                    <form className={styles.form} onSubmit={this.handleSubmitText} onBlur={this.handleSubmitText}>
                        {(!state.exists && !state.checkedDuplicate) && <label className={styles.error}> * Title does not exist </label>}
                        <input name="title" className={styles.input} aria-label="title" />
                    </form>
                    <div className={styles.extra} hidden={!state.duplicates && (!state.checkedDuplicate || state.exists)}>
                        <label> Duplicate titles, please enter extra info </label>
                        {(state.checkedDuplicate && (!state.exists || state.duplicates)) && <label className={styles.error}> * Incorrect info </label>}
                        <form onSubmit={this.handleSubmitExtra} onBlur={this.handleSubmitExtra} className={styles.form}>
                            <label> Movie/Show </label>
                            <input name="type" aria-label="type" />
                            <label> Release Year </label>
                            <input name="year" aria-label="year" />
                            <input type="submit" hidden />
                        </form>
                    </div>
                    <span>
                        <button type="button" onClick={this.handleSubmit}> Submit </button>
                        <button type="button" onClick={props.closeCreate}> Cancel </button>
                    </span>
                </div>
            </div>
        );
    }

};

export default CreateRecommendation;

// TODO: Display error if movie or title are wrong
