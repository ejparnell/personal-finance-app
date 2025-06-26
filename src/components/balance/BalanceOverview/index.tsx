import { BalanceType } from '@/types/balance';
import styles from './BalanceOverview.module.css';
import CurrentBalance from '../CurrentBalance';

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
            <CurrentBalance currentBalance={currentBalance} />

            {/* <div className={`${styles.balanceCard} ${styles.balanceCardLight}`}>
                <div className={styles.balanceCardHeader}>
                    <p
                        className={`${styles.balanceCardTitle} ${
                            styles.balanceCardTitleLight
                        }`}
                    >
                        Income
                    </p>
                    <DotEditor />
                </div>
                <p className={styles.balanceCardValue}>${income || '0.00'}</p>
            </div>

            <div className={`${styles.balanceCard} ${styles.balanceCardLight}`}>
                <div className={styles.balanceCardHeader}>
                    <p
                        className={`${styles.balanceCardTitle} ${
                            styles.balanceCardTitleLight
                        }`}
                    >
                        Expenses
                    </p>
                    <DotEditor />
                </div>
                <p className={styles.balanceCardValue}>${expenses || '0.00'}</p>
            </div> */}
        </div>
    );
}
