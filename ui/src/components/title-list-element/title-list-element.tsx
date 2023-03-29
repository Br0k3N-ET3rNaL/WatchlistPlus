import classNames from 'classnames';
import React from 'react';
import styles from './title-list-element.module.scss';
import { Title } from '../../interfaces';

type TitleListElementProps = {
    className?: string;
    children?: React.ReactNode;
    title: Title;
    loggedIn: boolean;
    displayTitle?: (title: Title) => void;
    displayEdit?: (title: Title) => void;
};

function TitleListElement(props: TitleListElementProps) {
    const { className, children, title, loggedIn, displayTitle, displayEdit } = props;

    return (
        <div className={classNames(styles.root, className)}>{children}
            <div />
            <div role="button" tabIndex={-1} className={styles.title}
                onClick={() => {
                    if (displayTitle !== undefined)
                        displayTitle(title);
                }}
                onKeyDown={() => {
                    if (displayTitle !== undefined)
                        displayTitle(title);
                }}
            >
                {title.title}
            </div>
            <div className={styles.year}> {title.releaseYear} </div>
            <div className={styles.rating}> {title.rating} </div>
            {(loggedIn && !title.watched?.status) && <div className={styles.add}>
                <button type="button" onClick={() => {
                    if (displayEdit)
                        displayEdit(title);
                }}> add </button>
            </div>}
            {(loggedIn && title.watched?.status) && <div className={styles.add}>
                <button type="button" onClick={() => {
                    if (displayEdit)
                        displayEdit(title);
                }}> edit </button>
            </div>}
        </div>
    );
}

export default TitleListElement;
