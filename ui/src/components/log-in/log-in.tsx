import classNames from 'classnames';
import React from 'react';
import styles from './log-in.module.scss';
import { User } from '../../context';

type LogInProps = {
    className?: string;
    children?: React.ReactNode;
    home?: (user?: User) => void;
};

type LogInState = {
    userExists: boolean;
    passwordsMatch: boolean;
    checked: boolean;
    user?: User,
};

class LogIn extends React.Component<LogInProps, LogInState> {
    constructor(props: LogInProps | Readonly<LogInProps>) {
        super(props);

        this.state = {
            userExists: true,
            passwordsMatch: true,
            checked: false,
        };
    }

    handleLogIn: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();

        if (email !== undefined && password !== undefined) {
            const requestOptions = {
                method: 'GET',
            };
            fetch(`/api/users/verify/${email}/${password}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    this.setState(
                        {
                            userExists: data.userExists,
                            passwordsMatch: data.passwordsMatch,
                            checked: true,
                            user: data.user,
                        },

                        this.checkLogin
                    );
                });
        }
    };

    checkLogin() {
        const { props, state } = this;

        if (state.checked && state.userExists && state.passwordsMatch) {
            if (props.home !== undefined) {
                props.home(state.user);
            }
        }
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>{props.children}
                <div className={styles.loginContainer}>
                    <form onSubmit={this.handleLogIn} className={styles.loginContainer}>
                        <div className={classNames('email', styles.loginElement)}>
                            <div>
                                <label> Email: </label>
                                <label className={styles.loginError} aria-label="no user" hidden={state.userExists}>
                                    * No user with given email
                                </label>
                            </div>
                            <input
                                name="email"
                                type="email"
                                className={styles.loginInput}
                                aria-label="email"
                            />
                        </div>
                        <div className={classNames('password', styles.loginElement)}>
                            <div>
                                <label> Password: </label>
                                <label className={styles.loginError} aria-label="do not match" hidden={state.passwordsMatch}>
                                    * Incorrect Password
                                </label>
                            </div>
                            <input
                                name="password"
                                type="password"
                                className={styles.loginInput}
                                aria-label="password"
                            />
                        </div>
                        <button type="button" className={styles.loginButton} aria-label="log in">
                            Log In
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default LogIn;
