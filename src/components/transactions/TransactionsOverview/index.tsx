import { TransactionType } from '@/types/transaction';
import OverviewCard from '@/components/shared/OverviewCard';
import OverviewCardHeader from '@/components/shared/OverviewCardHeader';
import TransactionsList from '../TransactionsList';

interface TransactionsOverviewProps {
    transactions?: TransactionType[];
    error?: string | null;
}

export default function TransactionsOverview({
    transactions,
    error,
}: TransactionsOverviewProps) {
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <OverviewCard theme="overviewLight">
            <OverviewCardHeader
                name="Transactions"
                href="/transactions"
                linkText="View All"
            />

            <TransactionsList transactions={transactions} />
        </OverviewCard>
    );
}
