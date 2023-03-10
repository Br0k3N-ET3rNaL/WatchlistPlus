import styles from './top-bar.module.scss';
import classNames from 'classnames';
import React from 'react';

// Test Commit

type TopBarProps = {
    className?: string;
    children?: React.ReactNode;
    signup?: () => void;
    login?: () => void;
    back?: (loggedIn: boolean) => void;
    home: boolean;
    loggedIn?: boolean;
}

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-top-bars-and-templates
 */
class TopBar extends React.Component<TopBarProps> {
    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div className={classNames('topbarLeft', styles.topbarLeft)}>
                    <span className={classNames('logo', styles.logo)}></span>
                </div>
                <span className={classNames('logo', styles.logo)}></span>
                <div className={classNames('topbarCenter', styles.topbarCenter)}></div>
                <div className={classNames('topbarRight', styles.topbarRight)}>
                    {(this.props.home && !this.props.loggedIn) && <div className={'topbarLinks'}>
                        <span
                            className={classNames('topbarLink', styles.topbarLink)}
                            onClick={this.props.signup}
                        >
                            Sign Up
                        </span>
                        <span
                            className={classNames('topbarLink', styles.topbarLink)}
                            onClick={this.props.login}
                        >
                            Log In
                        </span>
                    </div>}
                    {(!this.props.home && !this.props.loggedIn) && <span
                        className={classNames('topbarLink', styles.topbarLink)}
                        onClick={() => {
                            if (this.props.back !== undefined) {
                                this.props.back(false)
                            }
                        }}
                    >
                        Go Back
                    </span>}
                </div>
            </div>
        );
    }
};

export default TopBar;
