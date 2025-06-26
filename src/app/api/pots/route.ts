import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { Pot } from '@/models/Pot';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404
        });
    }

    const { name, target, total, theme } = await request.json();

    await dbConnect();

    const newPot = await Pot.create({
        user: user._id,
        name,
        target,
        total,
        theme,
    });

    return NextResponse.json(newPot);
}