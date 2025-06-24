import ArrowLink from '../ArrowLink';
import styles from './OverviewCardHeader.module.css';

interface OverviewCardHeaderProps {
    name: string;
    href: string;
    linkText: string;
}

export default function OverviewCardHeader({
    name,
    href,
    linkText,
}: OverviewCardHeaderProps) {
    return (
        <div className={styles.overviewCardHeader}>
            <h2 className={styles.overviewCardHeaderText}>{name}</h2>
            <ArrowLink href={href} text={linkText} />
        </div>
    );
}
