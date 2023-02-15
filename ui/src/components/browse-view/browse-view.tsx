import styles from './browse-view.module.scss';
import classNames from 'classnames';

export interface BrowseViewProps {
    className?: string;
    children?: React.ReactNode;
}

/**
 * This component was generated using Codux's built-in Default new component template.
 * For details on how to create custom new component templates, see https://help.codux.com/kb/en/article/configuration-for-browse-views-and-templates
 */
export const BrowseView = ({ className, children = 'BrowseView' }: BrowseViewProps) => {
    return <div className={classNames(styles.root, className)}></div>;
};

export default BrowseView;
