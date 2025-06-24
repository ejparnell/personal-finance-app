'use server';

import { getServerSession } from 'next-auth';
import { Balance } from '@/models/Balance';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';
import { toCents } from '@/lib/utils';
import { BalanceType, BalancesState } from '@/types/balance';

export async function getBalances(): Promise<BalancesState | never> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { balanceError: 'Unauthorized', balances: [] };
    }

    try {
        await dbConnect();

        const balances = await Balance.find({ userId: session.user.id }).sort({
            createdAt: -1,
        });
        const formattedBalances = balances.map(
            (balance) =>
                ({
                    _id: balance._id.toString(),
                    user: balance.user.toString(),
                    currentBalance: toCents(balance.currentBalance),
                    income: toCents(balance.income),
                    expenses: toCents(balance.expenses),
                }) as BalanceType
        );

        return { balances: formattedBalances, balanceError: null };
    } catch (error) {
        console.error('Error fetching balances:', error);
        return { balanceError: 'Failed to fetch balances', balances: [] };
    }
}
