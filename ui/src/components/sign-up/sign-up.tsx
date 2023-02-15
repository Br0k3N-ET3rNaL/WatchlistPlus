import styles from './sign-up.module.scss';
import classNames from 'classnames';
import React from 'react';

type SignUpProps = {
    className?: string;
    children?: React.ReactNode;
    login?: () => void;
};

type SignUpState = {
    username: string | undefined;
    validUsername: boolean;
    email: string | undefined;
    validEmail: boolean;
    password: string | undefined;
    passwordRepeat: string | undefined;
    passwordsMatch: boolean;
};

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-sign-ups-and-templates
 */
class SignUp extends React.Component<SignUpProps, SignUpState> {
    state: SignUpState = {
        username: undefined,
        validUsername: false,
        email: undefined,
        validEmail: false,
        password: undefined,
        passwordRepeat: undefined,
        passwordsMatch: false,
    }

    handleSubmitUsername: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const username = data.get('username')?.toString();
        if (username !== undefined) {
            const requestOptions = {
                method: 'GET',
            };
            fetch('/api/users/exists/username/' + username, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const exists = data.usernameExists;

                    if (!exists) {
                        this.setState({ username: username, validUsername: true });
                    } else {
                        this.setState({ validUsername: false });
                    }
                });
        } else {
            this.setState({ validUsername: false });
        }
    };

    handleSubmitEmail: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = data.get('email')?.toString();
        if (email !== undefined) {
            const requestOptions = {
                method: 'GET',
            };
            fetch('/api/users/exists/email/' + email, requestOptions)
                .then(response => response.json())
                .then(data => {
                    const exists = data.emailExists;

                    if (!exists) {
                        this.setState({ email: email, validEmail: true });
                    } else {
                        this.setState({ validEmail: false });
                    }
                });
            this.setState({ email: email, validEmail: true });
        } else {
            this.setState({ validEmail: false });
        }
    };

    handleSubmitPassword: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const password = data.get('password')?.toString();
        if (password !== undefined) {
            this.setState({ password: password }, this.passwordsMatch);
        }
    };

    handleSubmitPasswordRepeat: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const passwordRepeat = data.get('passwordRepeat')?.toString();

        if (passwordRepeat !== undefined) {
            this.setState({ passwordRepeat: passwordRepeat }, this.passwordsMatch);
        }
    };

    passwordsMatch() {
        if (this.state.password === this.state.passwordRepeat && this.state.password !== undefined && this.state.passwordRepeat !== undefined) {
            console.log('match');
            this.setState({ passwordsMatch: true });
        } else if (this.state.password !== this.state.passwordRepeat) {
            this.setState({ passwordsMatch: false });
        }
    }

    handleSignUp: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault();

        if (this.state.validUsername && this.state.validEmail && this.state.passwordsMatch) {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user: {
                        username: this.state.username,
                        email: this.state.email,
                        password: this.state.password,
                    },
                }),
            };
            const response = fetch('/api/users/', requestOptions);
            await response;
            if (this.props.login !== undefined) {
                this.props.login();
            }
        }
    };

    render() {
        return (
            <div className={classNames(styles.root, this.props.className)}>
                <div className={classNames('signupContainer', styles.signupContainer)}>
                    <div className={classNames('username', styles.signupElement)}>
                        <form onSubmitCapture={this.handleSubmitUsername} onBlurCapture={this.handleSubmitUsername}>
                            <label> Username: </label>
                            {(!this.state.validUsername && this.state.username !== undefined) && <label className={classNames('signupError', styles.signupError)}> * Username already exists </label>}
                            <input
                                name='username'
                                className={classNames('signupInput', styles.signupInput)}
                            />
                        </form>
                    </div>
                    <div className={classNames('email', styles.signupElement)}>
                        <form onSubmitCapture={this.handleSubmitEmail} onBlurCapture={this.handleSubmitEmail}>
                            <label> Email: </label>
                            {(!this.state.validEmail && this.state.email !== undefined) && <label className={classNames('signupError', styles.signupError)}> * Email already exists </label>}
                            <input
                                name='email'
                                type='email'
                                className={classNames('signupInput', styles.signupInput)}
                            />
                        </form>
                    </div>
                    <div className={classNames('password', styles.signupElement)}>
                        <form onSubmitCapture={this.handleSubmitPassword} onBlurCapture={this.handleSubmitPassword}>
                            <label> Password: </label>
                            {(!this.state.passwordsMatch && this.state.password !== undefined && this.state.passwordRepeat !== undefined) && <label className={classNames('signupError', styles.signupError)}> * Passwords don't match </label>}
                            <input
                                name='password'
                                type='password'
                                className={classNames('signupInput', styles.signupInput)}
                            />
                        </form>
                    </div>
                    <div className={classNames('passwordRepeat', styles.signupElement)}>
                        <form onSubmitCapture={this.handleSubmitPasswordRepeat} onBlurCapture={this.handleSubmitPasswordRepeat}>
                            <label> Repeat Password: </label>
                            <input
                                name='passwordRepeat'
                                type='password'
                                className={classNames('signupInput', styles.signupInput)}
                            />
                        </form>
                    </div>
                    <button
                        onClick={this.handleSignUp}
                        className={classNames('signupButton', styles.signupButton)}
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        );
    }
}

export default SignUp;
