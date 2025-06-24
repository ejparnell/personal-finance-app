import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { Transaction } from '@/models/Transaction';
import { Budget } from '@/models/Budget';
import { Pot } from '@/models/Pot';
import { toCents } from '@/lib/utils';
import seed from '@/data/seedData.json';

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Clear existing data
    await Transaction.deleteMany({ user: user._id });
    await Budget.deleteMany({ user: user._id });
    await Pot.deleteMany({ user: user._id });

    // Seed Transactions
    const txDocs = seed.transactions.map(t => ({
        user: user._id,
        avatar: t.avatar,
        name: t.name,
        category: t.category,
        date: new Date(t.date),
        amountCents: toCents(t.amount),
        recurring: t.recurring,
    }));

    const budgetDocs = seed.budgets.map(b => ({
        user: user._id,
        category: b.category,
        maximumCents: toCents(b.maximum),
        theme: b.theme,
    }));

    const potDocs = seed.pots.map(p => ({
        user: user._id,
        name: p.name,
        targetCents: toCents(p.target),
        totalCents: toCents(p.total),
        theme: p.theme,
    }));

    await Transaction.insertMany(txDocs);
    await Budget.insertMany(budgetDocs);
    await Pot.insertMany(potDocs);

    return NextResponse.json({
        success: true,
        message: 'Database seeded successfully',
    });
}
