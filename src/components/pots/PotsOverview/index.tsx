import Image from 'next/image';
import { PotLean } from '@/types/pot';
import ArrowLink from '@/components/shared/ArrowLink';
import styles from './PotsOverview.module.css';
import { formatCurrency } from '@/lib/currencyFunctions';

interface PotsOverviewProps {
    pots: PotLean[];
    error?: string | null;
}

export default function PotsOverview({ pots, error }: PotsOverviewProps) {
    const totalSaved = pots.reduce((acc, pot) => acc + (pot.total || 0), 0);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className={styles.potsOverviewContainer}>
            <div className={styles.potsOverviewHeader}>
                <h2>Pots</h2>
                <ArrowLink href="/pots" text="See Details" />
            </div>

            <div className={styles.potsOverviewTotal}>
                <Image
                    src="/icons/icon-pot.svg"
                    alt="Pot Icon"
                    width={26}
                    height={34}
                />
                <div className={styles.potsTotalSaved}>
                    <p className={styles.potsTotalSavedText}>Total Saved</p>
                    <p className={styles.potsTotalSavedAmount}>
                        ${totalSaved || '0.00'}
                    </p>
                </div>
            </div>

            <div className={styles.potsOverviewList}>
                {pots.length === 0 ? (
                    <p className={styles.potsOverviewText}>No pots available</p>
                ) : (
                    pots.map((pot) => (
                        <div key={pot._id} className={styles.potItemContainer}>
                            <div
                                className={styles.potIcon}
                                style={{
                                    backgroundColor: `var(--${pot.theme || 'default'})`,
                                }}
                            />
                            <div className={styles.potItem}>
                                <p className={styles.potName}>{pot.name}</p>
                                <p className={styles.potTotal}>
                                    {formatCurrency(pot.total)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
