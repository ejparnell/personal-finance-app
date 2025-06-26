import { getBalances } from '@/actions/balances';
import { getPots } from '@/actions/pots';
import { getTransactions } from '@/actions/transactions';
import { getBudgets } from '@/actions/budgets';
import BalanceOverview from '@/components/balance/BalanceOverview';
import PotsOverview from '@/components/pots/PotsOverview';
import TransactionsOverview from '@/components/transactions/TransactionsOverview';
import BudgetsOverview from '@/components/budgets/BudgetsOverview';
import RecurringBillsOverview from '@/components/recurringBills/RecurringBillsOverview';
import styles from './page.module.css';


export default async function OverviewPage() {
    const { balances = [], balanceError } = await getBalances();
    const { pots = [], potError } = await getPots();
    const { transactions = [], transactionError } = await getTransactions();
    const { budgets = [], budgetError } = await getBudgets();
    const paidBills = 0;
    const upcomingBills = 0;
    const dueSoon = 0;

    return (
        <div className={styles.overviewContainer}>
            <h1 className={styles.overviewTitle}>Overview</h1>

            <BalanceOverview balances={balances} error={balanceError} />

            <div className={styles.overviewContent}>
                <PotsOverview pots={pots} error={potError} />
                <TransactionsOverview
                    transactions={transactions}
                    error={transactionError}
                />
                <BudgetsOverview budgets={budgets} error={budgetError} />
                <RecurringBillsOverview
                    paidBills={paidBills}
                    upcomingBills={upcomingBills}
                    dueSoon={dueSoon}
                />
            </div>
        </div>
    );
}
