import { BalanceType } from '@/types/balance';
import styles from './BalanceOverview.module.css';

interface BalanceOverviewProps {
    balances: BalanceType[];
    error?: string | null;
}

export default function BalanceOverview({
    balances,
    error,
}: BalanceOverviewProps) {
    const { currentBalance, income, expenses } = balances[0] || {};

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.balanceOverviewContainer}>
            <div className={`${styles.balanceCard} ${styles.balanceCardDark}`}>
                <p
                    className={`${styles.balanceCardTitle} ${
                        styles.balanceCardTitleDark
                    }`}
                >
                    Current Balance
                </p>
                <p className={styles.balanceCardValue}>
                    ${currentBalance || '0.00'}
                </p>
            </div>

            <div className={`${styles.balanceCard} ${styles.balanceCardLight}`}>
                <p
                    className={`${styles.balanceCardTitle} ${
                        styles.balanceCardTitleLight
                    }`}
                >
                    Income
                </p>
                <p className={styles.balanceCardValue}>${income || '0.00'}</p>
            </div>

            <div className={`${styles.balanceCard} ${styles.balanceCardLight}`}>
                <p
                    className={`${styles.balanceCardTitle} ${
                        styles.balanceCardTitleLight
                    }`}
                >
                    Expenses
                </p>
                <p className={styles.balanceCardValue}>${expenses || '0.00'}</p>
            </div>
        </div>
    );
}
