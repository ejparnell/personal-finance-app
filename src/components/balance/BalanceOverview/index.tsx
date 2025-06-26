import { BalanceType } from '@/types/balance';
import CurrentBalance from '../CurrentBalance';
import IncomeBalance from '../IncomeBalance';
import ExpensesBalance from '../ExpensesBalance';
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
            <CurrentBalance currentBalance={currentBalance} />
            <IncomeBalance income={income} />
            <ExpensesBalance expenses={expenses} />
        </div>
    );
}
