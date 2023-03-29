import React from 'react';
import styles from './page-controller.module.scss';

type PageControllerProps = {
    className?: string;
    children?: React.ReactNode;
    page: number;
    onNextPage?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onPrevPage?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onFirstPage?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

class PageController extends React.Component<PageControllerProps> {
    handleNextPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        const { props } = this;

        props.onNextPage?.(e);
    };

    handlePrevPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        const { props } = this;

        props.onPrevPage?.(e);
    };

    handleFirstPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        const { props } = this;

        props.onFirstPage?.(e);
    };

    render() {
        const { props } = this;

        return (
            <div className={props.className}>{props.children}
                <div className={styles.pageButtons}>
                    <button
                        type="button"
                        onClick={this.handleFirstPage}
                        className={styles.pageButton}
                        aria-label="first"
                        disabled={props.page <= 2}
                    >
                        &lt;&lt;
                    </button>
                    <button
                        type="button"
                        onClick={this.handlePrevPage}
                        className={styles.pageButton}
                        aria-label="prev"
                        disabled={props.page === 1}
                    >
                        &lt;
                    </button>
                    <div className={styles.pageButton}>{props.page}</div>
                    <button
                        type="button"
                        onClick={this.handleNextPage}
                        className={styles.pageButton}
                        aria-label="next"
                        disabled={false}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        );
    }
};

export default PageController;
