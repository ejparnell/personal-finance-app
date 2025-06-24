import { getBalances } from '@/actions/balances';
import BalanceOverview from '@/components/balance/BalanceOverview';
import styles from './page.module.css';

export default async function OverviewPage() {
    const { balances = [], error } = await getBalances();
    console.log('Balances:', balances);

    return (
        <div className={styles.overviewContainer}>
            <h1 className={styles.overviewTitle}>Overview</h1>

            <BalanceOverview balances={balances} error={error} />
        </div>
    );
}
