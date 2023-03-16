import styles from './create-recommendation.module.scss';
import classNames from 'classnames';
import React from 'react';
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

    state: CreateRecommendationState = {
        exists: true,
        duplicates: false,
        checked: false,
        checkedDuplicate: false,
    }

    componentDidMount(): void {
        this.setState({ user: this.context });
    }

    handleSubmitText: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        const data = new FormData(e.currentTarget);
        const title = data.get('title')?.toString();

        if (title) {
            this.setState({ otherTitle: title });
            const requestOptions = {
                method: 'GET',
            };
            fetch('/api/titles/verify/' + title + '/', requestOptions)
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

        const data = new FormData(e.currentTarget);
        const type = data.get('type')?.toString();
        const releaseYear = Number(data.get('year')?.toString());

        if (type && releaseYear) {
            
            const requestOptions = {
                method: 'GET',
            };
            fetch('/api/titles/verify/' + this.state.otherTitle + '/' + type + '/' + releaseYear + '/', requestOptions)
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

    async createIfValid () {
        if (this.state.checked && this.state.exists && !this.state.duplicates) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recommendation: {
                        title1Id: this.props.titleId,
                        title2Id: this.state.otherTitleId,
                        userId: this.state.user!.id,
                    }
                }),
            };
            await fetch('/api/recommendations/', requestOptions).then(() => {
                this.props.closeCreate?.();
            });
        }
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>{this.props.children}
                <span className={styles.titleBar}>
                    <h2 className={styles.title}> Recommend Title Based On {this.props.title} </h2>
                    <button className={styles.closeButton} onClick={this.props.closeCreate}> X </button>
                </span>
                <div className={styles.bottomBar}>
                    <form className={styles.form} onSubmit={this.handleSubmitText} onBlur={this.handleSubmitText}>
                        {(!this.state.exists && !this.state.checkedDuplicate) && <label className={styles.error}> * Title does not exists </label>}
                        <input name={'title'} className={styles.input} />
                    </form>
                    {(this.state.duplicates || (this.state.checkedDuplicate && !this.state.exists)) && <div className={styles.extra}>
                        <label> Duplicate titles, please enter extra info </label>
                        {(this.state.checkedDuplicate && (!this.state.exists || this.state.duplicates)) && <label className={styles.error}> * Incorrect info </label>}
                        <form onSubmit={this.handleSubmitExtra} onBlur={this.handleSubmitExtra} className={styles.form}>
                            <label> Movie/Show </label>
                            <input name={'type'} />
                            <label> Release Year </label>
                            <input name={'year'} />
                        </form>
                    </div>}
                    <span>
                        <button onClick={this.handleSubmit}> Submit </button>
                        <button onClick={this.props.closeCreate}> Cancel </button>
                    </span>
                </div>
            </div>
        );
    }

};

export default CreateRecommendation;

// TODO: Display error if movie or title are wrong
