import styles from './title-list-element.module.scss';
import classNames from 'classnames';
import React from 'react';

type TitleListElementProps = {
    className?: string;
    children?: React.ReactNode;
    key: number;
    title: { id: string, title: string, type: string, description: string, releaseYear: number, ageGuidance: string, runtime: number, rating: number, genres: string[] };
    loggedIn: boolean;
    onList?: boolean;
    displayTitle?: (title: { id: string, title: string, type: string, description: string, releaseYear: number, ageGuidance: string, runtime: number, rating: number, genres: string[] }) => void;
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
    displayTitle() {

        if (this.props.displayTitle !== undefined) {
            console.log('clicked');
            this.props.displayTitle(this.props.title);
        }
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div />
                <div className={styles.title} onClick={() => {
                    if (this.props.displayTitle !== undefined)
                        this.props.displayTitle(this.props.title)
                }}> {this.props.title.title} </div>
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
