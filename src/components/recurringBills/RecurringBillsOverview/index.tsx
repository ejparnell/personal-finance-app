import OverviewCard from "@/components/shared/OverviewCard";
import OverviewCardHeader from "@/components/shared/OverviewCardHeader";
import styles from "./RecurringBillsOverview.module.css";

interface RecurringBillsOverviewProps {
    paidBills: number;
    upcomingBills: number;
    dueSoon: number;
}

export default function RecurringBillsOverview({ paidBills, upcomingBills, dueSoon }: RecurringBillsOverviewProps) {
    return (
        <OverviewCard>
            <OverviewCardHeader name='Recurring Bills' href='/recurring-bills' linkText='See Details' />
            <div className={styles.rbOverviewContainer}>
                <div className={styles.rbOverviewItem}>
                    <div className={`${styles.rbOverviewIndicator} ${styles.indicatorPaid}`} />
                    <div className={styles.rbOverviewContent}>
                        <h3 className={styles.rbOverviewText}>Paid Bills</h3>
                        <p className={styles.rbOverviewAmount}>${paidBills || '0.00'}</p>
                    </div>
                </div>

                <div className={styles.rbOverviewItem}>
                    <div className={`${styles.rbOverviewIndicator} ${styles.indicatorUpcoming}`} />
                    <div className={styles.rbOverviewContent}>
                        <h3 className={styles.rbOverviewText}>Upcoming Bills</h3>
                        <p className={styles.rbOverviewAmount}>${upcomingBills || '0.00'}</p>
                    </div>
                </div>

                <div className={styles.rbOverviewItem}>
                    <div className={`${styles.rbOverviewIndicator} ${styles.indicatorDueSoon}`} />
                    <div className={styles.rbOverviewContent}>
                        <h3 className={styles.rbOverviewText}>Due Soon</h3>
                        <p className={styles.rbOverviewAmount}>${dueSoon || '0.00'}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
}