import { getBalances } from '@/actions/balances';
import { getPots } from '@/actions/pots';
import BalanceOverview from '@/components/balance/BalanceOverview';
import PotsOverview from '@/components/pots/PotsOverview';
import styles from './page.module.css';

export default async function OverviewPage() {
    const { balances = [], balanceError } = await getBalances();
    const { pots = [], potError } = await getPots();

    return (
        <div className={styles.overviewContainer}>
            <h1 className={styles.overviewTitle}>Overview</h1>

            <BalanceOverview balances={balances} error={balanceError} />

            <div>
                <PotsOverview pots={pots} error={potError} />
            </div>
        </div>
    );
}
