import classNames from 'classnames';
import React from 'react';
import styles from './top-bar.module.scss';

type TopBarProps = {
    className?: string;
    children?: React.ReactNode;
    signup?: () => void;
    login?: () => void;
    back?: () => void;
    watchlist?: () => void;
    home: boolean;
    loggedIn?: boolean;
}

function TopBar(props: TopBarProps) {
    const { className, children, signup, login, back, watchlist, home, loggedIn } = props;

    return (
        <div className={classNames(styles.root, className)}>{children}
            <div className={classNames('topbarLeft', styles.topbarLeft)}>
                <span className={classNames('logo', styles.logo)} />
            </div>
            <span className={classNames('logo', styles.logo)} />
            <div className={classNames('topbarCenter', styles.topbarCenter)} />
            <div className={classNames('topbarRight', styles.topbarRight)}>
                {(home && !loggedIn) && <div className="topbarLinks">
                    <span
                        role="button"
                        tabIndex={-1}
                        className={classNames('topbarLink', styles.topbarLink)}
                        onClick={signup}
                        onKeyDown={signup}
                    >
                        Sign Up
                    </span>
                    <span
                        role="button"
                        tabIndex={-1}
                        className={classNames('topbarLink', styles.topbarLink)}
                        onClick={login}
                        onKeyDown={login}
                    >
                        Log In
                    </span>
                </div>}
                {(!home && !loggedIn) && <span
                    role="button"
                    tabIndex={-1}
                    className={classNames('topbarLink', styles.topbarLink)}
                    onClick={back}
                    onKeyDown={back}
                >
                    Go Back
                </span>}
                {loggedIn && <span
                    role="button"
                    tabIndex={-1}
                    className={classNames('topbarLink', styles.topbarLink)}
                    onClick={watchlist}
                    onKeyDown={watchlist}
                >
                    Watchlist
                </span>}
            </div>
        </div>
    );
};

export default TopBar;
