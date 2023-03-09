import styles from './page-controller.module.scss';
import React from 'react';

type PageControllerProps = {
    className?: string;
    children?: React.ReactNode;
    page: number;
    onNextPage?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onPrevPage?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onFirstPage?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-page-controllers-and-templates
 */
class PageController extends React.Component<PageControllerProps> {
    handleNextPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.props.onNextPage?.(e);
    };

    handlePrevPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.props.onPrevPage?.(e);
    };

    handleFirstPage: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        e.preventDefault();

        this.props.onFirstPage?.(e);
    };

    render() {
        return (
            <div className={this.props.className}>{this.props.children}
                <div className={styles.pageButtons}>
                    <button
                        onClick={this.handleFirstPage}
                        className={styles.pageButton}
                        aria-label={'first'}
                        disabled={this.props.page <= 2}
                    >
                        &lt;&lt;
                    </button>
                    <button
                        onClick={this.handlePrevPage}
                        className={styles.pageButton}
                        aria-label={'prev'}
                        disabled={this.props.page === 1}
                    >
                        &lt;
                    </button>
                    <div className={styles.pageButton}>{this.props.page}</div>
                    <button
                        onClick={this.handleNextPage}
                        className={styles.pageButton}
                        aria-label={'next'}
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
