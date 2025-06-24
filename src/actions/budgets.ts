'use server';

import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';
import { Budget } from '@/models/Budget';
import { BudgetType, BudgetsState } from '@/types/budget';

export async function getBudgets(): Promise<BudgetsState | never> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { budgetError: 'Unauthorized', budgets: [] };
    }

    try {
        await dbConnect();

        const budgets = await Budget.find({ user: session.user.id }).sort({
            createdAt: -1,
        });
        const formattedBudgets = budgets.map(
            (budget) =>
                ({
                    _id: budget._id.toString(),
                    user: budget.user.toString(),
                    category: budget.category,
                    maximum: budget.maximum,
                    theme: budget.theme || '',
                }) as BudgetType
        );

        return { budgets: formattedBudgets, budgetError: null };
    } catch (error) {
        console.error('Error fetching budgets:', error);
        return { budgetError: 'Failed to fetch budgets', budgets: [] };
    }
}
