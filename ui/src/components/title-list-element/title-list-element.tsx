import styles from './title-list-element.module.scss';
import classNames from 'classnames';
import React from 'react';
import { Title } from '../../App';

type TitleListElementProps = {
    className?: string;
    children?: React.ReactNode;
    key: number;
    title: Title;
    loggedIn: boolean;
    displayTitle?: (title: Title) => void;
    displayEdit?: (title: Title) => void;
    removeFromList?: () => void;
};

type TitleListElementState = {};

class TitleListElement extends React.Component<TitleListElementProps, TitleListElementState> {
    displayTitle() {
        if (this.props.displayTitle !== undefined) {
            this.props.displayTitle(this.props.title);
        }
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div />
                <div className={styles.title} onClick={() => {
                    if (this.props.displayTitle !== undefined)
                        this.props.displayTitle(this.props.title);
                }}> {this.props.title.title} </div>
                <div className={styles.year}> {this.props.title.releaseYear} </div>
                <div className={styles.rating}> {this.props.title.rating} </div>
                {(this.props.loggedIn && !this.props.title.watched?.status) && <div className={styles.add}>
                    <button onClick={() => {
                        if (this.props.displayEdit)
                            this.props.displayEdit(this.props.title);
                    }}> add </button>
                </div>}
                {(this.props.loggedIn && this.props.title.watched?.status) && <div className={styles.add}>
                    <button onClick={() => {
                        if (this.props.displayEdit)
                            this.props.displayEdit(this.props.title);
                    }}> edit </button>
                </div>}
            </div>
        );
    }
}

export default TitleListElement;
