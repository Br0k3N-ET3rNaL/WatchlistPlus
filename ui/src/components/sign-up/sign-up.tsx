import classNames from 'classnames';
import React from 'react';
import styles from './sign-up.module.scss';

type SignUpProps = {
    className?: string;
    children?: React.ReactNode;
    login?: () => void;
};

type SignUpState = {
    username?: string;
    validUsername: boolean;
    checkedUsername: boolean;
    email?: string;
    validEmail: boolean;
    password?: string;
    passwordRepeat?: string;
    passwordsMatch: boolean;
};

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-sign-ups-and-templates
 */
class SignUp extends React.Component<SignUpProps, SignUpState> {
    constructor(props: SignUpProps | Readonly<SignUpProps>) {
        super(props);

        this.state = {
            validUsername: false,
            checkedUsername: false,
            validEmail: false,
            passwordsMatch: false,
        };
    }

    handleSubmitUsername: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const username = formData.get('username')?.toString();

        if (username !== undefined) {
            const requestOptions = {
                method: 'GET',
            };
            fetch(`/api/users/exists/username/${username}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const exists = data.usernameExists;

                    if (!exists) {
                        this.setState({ username, validUsername: true, checkedUsername: true });
                    } else {
                        this.setState({ validUsername: false, checkedUsername: true });
                    }
                });
        } else {
            this.setState({ validUsername: false });
        }
    };

    handleSubmitEmail: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email')?.toString();
        if (email !== undefined) {
            const requestOptions = {
                method: 'GET',
            };
            fetch(`/api/users/exists/email/${email}`, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    const exists = data.emailExists;

                    if (!exists) {
                        this.setState({ email, validEmail: true });
                    } else {
                        this.setState({ validEmail: false });
                    }
                });
            this.setState({ email, validEmail: true });
        } else {
            this.setState({ validEmail: false });
        }
    };

    handleSubmitPassword: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const password = data.get('password')?.toString();
        if (password !== undefined) {
            this.setState({ password }, this.passwordsMatch);
        }
    };

    handleSubmitPasswordRepeat: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const passwordRepeat = data.get('passwordRepeat')?.toString();

        if (passwordRepeat !== undefined) {
            this.setState({ passwordRepeat }, this.passwordsMatch);
        }
    };

    handleSignUp: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        const { props, state } = this;

        if (state.validUsername && state.validEmail && state.passwordsMatch) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: {
                        username: state.username,
                        email: state.email,
                        password: state.password,
                    },
                }),
            };
            const response = fetch('/api/users/', requestOptions);
            await response;
            if (props.login !== undefined) {
                props.login();
            }
        }
    };

    passwordsMatch() {
        const { state } = this;

        if (
            state.password === state.passwordRepeat &&
            state.password !== undefined &&
            state.passwordRepeat !== undefined
        ) {
            this.setState({ passwordsMatch: true });
        } else if (state.password !== state.passwordRepeat) {
            this.setState({ passwordsMatch: false });
        }
    }

    render() {
        const { props, state } = this;

        return (
            <div className={classNames(styles.root, props.className)}>{props.children}
                <div className={classNames('signupContainer', styles.signupContainer)}>
                    <div className={classNames('username', styles.signupElement)}>
                        <form
                            onSubmitCapture={this.handleSubmitUsername}
                            onBlurCapture={this.handleSubmitUsername}
                        >
                            <label> Username: </label>
                            <label className={styles.signupError} hidden={state.validUsername || !state.checkedUsername}>
                                * Username already exists
                            </label>
                            <input
                                name="username"
                                className={styles.signupInput}
                                aria-label="username"
                            />
                        </form>
                    </div>
                    <div className={classNames('email', styles.signupElement)}>
                        <form
                            onSubmitCapture={this.handleSubmitEmail}
                            onBlurCapture={this.handleSubmitEmail}
                        >
                            <label> Email: </label>
                            <label className={styles.signupError} hidden={state.validEmail || state.email === undefined}>* Email already exists</label>
                            <input
                                name="email"
                                type="email"
                                className={styles.signupInput}
                                aria-label="email"
                            />
                        </form>
                    </div>
                    <div className={classNames('password', styles.signupElement)}>
                        <form
                            onSubmitCapture={this.handleSubmitPassword}
                            onBlurCapture={this.handleSubmitPassword}
                        >
                            <label> Password: </label>
                            <label
                                className={styles.signupError}
                                aria-label="error"
                                hidden={
                                    state.passwordsMatch ||
                                    state.password === undefined ||
                                    state.passwordRepeat === undefined
                                }
                            >
                                * Passwords don&apos;t match
                            </label>
                            <input
                                name="password"
                                type="password"
                                className={styles.signupInput}
                                aria-label="password"
                                title="password"
                            />
                        </form>
                    </div>
                    <div className={classNames('passwordRepeat', styles.signupElement)}>
                        <form
                            onSubmitCapture={this.handleSubmitPasswordRepeat}
                            onBlurCapture={this.handleSubmitPasswordRepeat}
                        >
                            <label> Repeat Password: </label>
                            <input
                                name="passwordRepeat"
                                type="password"
                                className={styles.signupInput}
                                aria-label="repeat"
                            />
                        </form>
                    </div>
                    <button
                        type="button"
                        onClick={this.handleSignUp}
                        className={styles.signupButton}
                        aria-label="sign up"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }
}

export default SignUp;
