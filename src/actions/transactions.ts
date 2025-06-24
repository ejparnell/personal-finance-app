'use server';

import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';
import { Transaction } from '@/models/Transaction';
import { TransactionType, TransactionsState } from '@/types/transaction';

export async function getTransactions(): Promise<TransactionsState | never> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { transactionError: 'Unauthorized', transactions: [] };
    }

    try {
        await dbConnect();

        const transactions = await Transaction.find({ userId: session.user.id }).sort({
            createdAt: -1,
        });
        const formattedTransactions = transactions.map(
            (transaction) =>
                ({
                    _id: transaction._id.toString(),
                    user: transaction.user.toString(),
                    avatar: transaction.avatar,
                    name: transaction.name,
                    category: transaction.category,
                    date: transaction.date.toISOString(),
                    amount: transaction.amount,
                    recurring: transaction.recurring,
                }) as TransactionType
        );

        return { transactions: formattedTransactions, transactionError: null };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { transactionError: 'Failed to fetch transactions', transactions: [] };
    }
}