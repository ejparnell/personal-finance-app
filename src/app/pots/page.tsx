import { getPots } from '@/actions/pots';
import styles from './page.module.css';
import PotsList from '@/components/pots/PotsList';
import PotsCreate from '@/components/pots/PotsCreate';

export default async function PotsPage() {
    const { pots = [], potError } = await getPots();

    return (
        <div className={styles.potsContainer}>
            <h1 className={styles.potsTitle}>Pots</h1>

            <PotsList onLoadPots={pots} error={potError} />
            <PotsCreate />
        </div>
    );
}
