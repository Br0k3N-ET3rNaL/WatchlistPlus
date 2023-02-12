import styles from './sign-up.module.scss';
import classNames from 'classnames';

export interface SignUpProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-sign-ups-and-templates
 */
export const SignUp = ({ className, children = 'SignUp' }: SignUpProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={classNames('signupContainer', styles.signupContainer)}>
                <div className={classNames('username', styles.signupElement)}>
                    Username:
                    <input className={classNames('signupInput', styles.signupInput)} />
                </div>
                <div className={classNames('email', styles.signupElement)}>
                    Email:
                    <input className={classNames('signupInput', styles.signupInput)} />
                </div>
                <div className={classNames('password', styles.signupElement)}>
                    Password:
                    <input
                        type="password"
                        className={classNames('signupInput', styles.signupInput)}
                    />
                </div>
                <div className={classNames('passwordRepeat', styles.signupElement)}>
                    Repeat Password:
                    <input
                        type="password"
                        className={classNames('signupInput', styles.signupInput)}
                    />
                </div>
                <button className={classNames('signupButton', styles.signupButton)}>Sign Up</button>
            </div>
        </div>
    );
};
