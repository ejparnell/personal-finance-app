import React from 'react';
import styles from './OverviewCard.module.css';

interface OverviewCardProps {
    children: React.ReactNode;
    theme?: 'overviewLight' | 'overviewDark';
}

export default function OverviewCard({ children, theme = 'overviewLight' }: OverviewCardProps) {
    return (
        <div className={`${styles.overviewCard} ${styles[theme]}`}>
            {children}
        </div>
    )
}