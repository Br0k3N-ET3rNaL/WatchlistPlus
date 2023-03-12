import styles from './log-in.module.scss';
import classNames from 'classnames';
import React from 'react';

type LogInProps = {
    className?: string;
    children?: React.ReactNode;
    home?: (userID?: number) => void;
};

type LogInState = {
    userExists: boolean;
    passwordsMatch: boolean;
    checked: boolean;
    userID?: number,
};

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-log-ins-and-templates
 */
class LogIn extends React.Component<LogInProps, LogInState> {
    state: LogInState = {
        userExists: true,
        passwordsMatch: true,
        checked: false,
    };

    handleLogIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (email !== undefined && password !== undefined) {
            const requestOptions = {
                method: 'GET',
            };
            fetch('/api/users/verify/' + email + '/' + password, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    this.setState(
                        {
                            userExists: data.userExists,
                            passwordsMatch: data.passwordsMatch,
                            checked: true,
                            userID: data.userID,
                        },

                        this.checkLogin
                    );
                });
        }
    };

    checkLogin() {
        if (this.state.checked && this.state.userExists && this.state.passwordsMatch) {
            if (this.props.home !== undefined) {
                this.props.home(this.state.userID);
            }
        }
    }

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div className={styles.loginContainer}>
                    <form onSubmit={this.handleLogIn} className={styles.loginContainer}>
                        <div className={classNames('email', styles.loginElement)}>
                            <div>
                                <label> Email: </label>
                                <label className={styles.loginError} aria-label={'no user'} hidden={this.state.userExists}>
                                    * No user with given email
                                </label>
                            </div>
                            <input
                                name="email"
                                type="email"
                                className={styles.loginInput}
                                aria-label={'email'}
                            />
                        </div>
                        <div className={classNames('password', styles.loginElement)}>
                            <div>
                                <label> Password: </label>
                                <label className={styles.loginError} aria-label={'do not match'} hidden={this.state.passwordsMatch}>
                                    * Incorrect Password
                                </label>
                            </div>
                            <input
                                name="password"
                                type="password"
                                className={styles.loginInput}
                                aria-label={'password'}
                            />
                        </div>
                        <button className={styles.loginButton} aria-label={'log in'}>
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default LogIn;
