'use client';

import DotEditor from '@/components/shared/DotEditor';
import styles from './BalanceCardHeader.module.css';

interface BalanceCardHeaderProps {
    name: string;
    theme?: 'light' | 'dark';
    handleOpenEdit?: () => void;
}

export default function BalanceCardHeader({ name, handleOpenEdit, theme = 'light' }: BalanceCardHeaderProps) {

    return (
        <div className={styles.balanceCardHeader}>
            <p className={`${styles.balanceCardTitle} ${theme === 'dark' ? styles.balanceCardTitleDark : styles.balanceCardTitleLight}`}>
                {name}
            </p>

            <DotEditor name={name} side='left' handleOpenEdit={handleOpenEdit} />
        </div>
    )
}