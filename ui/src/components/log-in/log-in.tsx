import styles from './log-in.module.scss';
import classNames from 'classnames';

export interface LogInProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-log-ins-and-templates
 */
export const LogIn = ({ className, children = 'LogIn' }: LogInProps) => {
    return (
        <div className={classNames(styles.root, className)}>
            <div className={classNames('loginContainer', styles.loginContainer)}>
                <div className={classNames('email', styles.loginElement)}>
                    Email:
                    <input className={classNames('loginInput', styles.loginInput)} />
                </div>
                <div className={classNames('password', styles.loginElement)}>
                    Password:
                    <input
                        type="password"
                        className={classNames('loginInput', styles.loginInput)}
                    />
                </div>
                <button className={classNames('loginButton', styles.loginButton)}>Log In</button>
            </div>
        </div>
    );
};
