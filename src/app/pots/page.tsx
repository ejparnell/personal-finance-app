import { getPots } from '@/actions/pots';
import styles from './page.module.css';
import PotsUI from '@/components/pots/PotsUI';

export default async function PotsPage() {
    const { pots = [], potError } = await getPots();

    console.log('Pots:', pots);
    // console.error('Pot Error:', potError);

    return (
        <div className={styles.potsContainer}>
            <h1 className={styles.potsTitle}>Pots</h1>

            <PotsUI onLoadPots={pots} error={potError} />
        </div>
    );
}
