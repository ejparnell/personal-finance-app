import { TransactionType } from "@/types/transaction";
import Transaction from "./Transaction";
import styles from "./TransactionsList.module.css";

interface TransactionsOverviewProps {
    transactions?: TransactionType[];
}

export default function TransactionsList({ transactions }: TransactionsOverviewProps) {

    if (!transactions || transactions.length === 0) {
        return <div className={styles.transactionsListText}>No transactions found</div>;
    }

    return (
        <div>
            {transactions.map((transaction) => (
                <Transaction
                    key={transaction._id}
                    avatar={transaction.avatar}
                    name={transaction.name}
                    amount={transaction.amount}
                    date={transaction.date}
                />
            ))}
        </div>
    );
}