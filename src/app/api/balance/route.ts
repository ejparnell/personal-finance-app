import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/dbConnect';
import { Balance } from '@/models/Balance';

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentBalance, income, expenses } = await request.json();

    await dbConnect();

    const balance = await Balance.findOneAndUpdate(
        { user: session.user.id },
        { currentBalance, income, expenses },
        { new: true, upsert: true }
    );

    return NextResponse.json(balance);
}
