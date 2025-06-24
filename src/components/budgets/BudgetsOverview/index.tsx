import { BudgetType } from "@/types/budget";
import OverviewCard from "@/components/shared/OverviewCard";
import OverviewCardHeader from "@/components/shared/OverviewCardHeader";
import styles from './BudgetsOverview.module.css';

interface BudgetsOverviewProps {
    budgets: BudgetType[];
    error?: string | null; 
}

export default function BudgetsOverview({ budgets, error }: BudgetsOverviewProps) {

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <OverviewCard >
            <OverviewCardHeader name='Budgets' href='/budgets' linkText='See Details' />

            <div>
                {budgets.length === 0 ? (
                    <p className={styles.budgetOverviewText}>No budgets available</p>
                ) : (
                    budgets.map((budget) => (
                        <div key={budget._id}>
                            <div>
                                <h3>{budget.category}</h3>
                                <p >Max: ${budget.maximum.toFixed(2)}</p>
                            </div>
                            <span>
                                {budget.theme || 'Default'}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </OverviewCard>
    );
}