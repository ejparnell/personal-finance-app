import { formatCurrency } from '@/lib/utils';
import styles from './BalanceCard.module.css';

interface BalanceCardProps {
    balance: number;
    theme?: 'light' | 'dark';
    children?: React.ReactNode;
}

export default function BalanceCard({
    balance,
    theme = 'light',
    children,
}: BalanceCardProps) {
    return (
        <div
            className={`${styles.balanceCard} ${theme === 'dark' ? styles.balanceCardDark : styles.balanceCardLight}`}
        >
            {children}
            <p className={styles.balanceCardValue}>
                {formatCurrency(balance) || '0.00'}
            </p>
        </div>
    );
}
