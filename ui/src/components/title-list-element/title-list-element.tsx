import styles from './title-list-element.module.scss';
import classNames from 'classnames';
import React from 'react';

type TitleListElementProps = {
    className?: string;
    children?: React.ReactNode;
    key: number;
    title: { title: string; releaseYear: number; rating: number };
    loggedIn: boolean;
    onList?: boolean;
    addToList?: () => void;
    removeFromList?: () => void;
};

// TODO Remove if empty later
type TitleListElementState = {};

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-title-list-elements-and-templates
 */
class TitleListElement extends React.Component<TitleListElementProps, TitleListElementState> {
    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div />
                <div className={styles.title}> {this.props.title.title} </div>
                <div className={styles.year}> {this.props.title.releaseYear} </div>
                <div className={styles.rating}> {this.props.title.rating} </div>
                {this.props.loggedIn && <div className={styles.add}>
                    <input type="checkbox" defaultChecked={this.props.onList} />
                </div>}
            </div>
        );
    }
}

export default TitleListElement;
