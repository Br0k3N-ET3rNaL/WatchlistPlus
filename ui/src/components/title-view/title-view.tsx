import styles from './title-view.module.scss';
import classNames from 'classnames';
import React from 'react';

type TitleViewProps = {
    className?: string;
    children?: React.ReactNode;
    title: {
        id: string,
        title: string;
        type: string;
        description: string;
        releaseYear: number;
        ageGuidance: string;
        runtime: number;
        rating: number;
        genres: string[];
    };
    closeTitle?: () => void;
};

type TitleViewState = {
    genres: any;
}

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-title-views-and-templates
 */
class TitleView extends React.Component<TitleViewProps, TitleViewState> {
state: TitleViewState = {
    genres: undefined,
}

    componentDidMount(): void {
        this.setState({
            genres: this.props.title.genres.map((genre: string) => <li key={genre} className={styles.genres}> {genre.replace(/'/g, '')} </li>),
        })
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div className={styles.mainView}>
                    <div className={styles.title}>
                        {this.props.title.title}
                        <button className={styles.closeButton} onClick={this.props.closeTitle}>
                            X
                        </button>
                    </div>
                    <div className={styles.infoBar}>
                        <div className={styles.infoBarElement}> {this.props.title.type} </div>
                        <div className={styles.infoBarElement}>{this.props.title.releaseYear}</div>
                        <div className={styles.infoBarElement}>{this.props.title.ageGuidance}</div>
                        <div className={styles.infoBarElement}> {this.props.title.runtime}mins </div>
                    </div>
                    <div className={styles.infoBar}>
                        <ul className={styles.genreList}>
                            {this.state.genres}
                        </ul>
                    </div>
                    <div className={styles.description}>{this.props.title.description}</div>
                </div>
            </div>
        );
    }
}

export default TitleView;
