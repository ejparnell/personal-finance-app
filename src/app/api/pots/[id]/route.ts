import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { dbConnect } from '@/lib/dbConnect';
import { User } from '@/models/User';
import { Pot } from '@/models/Pot';

// PATCH for a single pot
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = params;
    const { name, target, total, theme } = await request.json();
    await dbConnect();

    const pot = await Pot.findById(id);
    if (!pot) {
        return NextResponse.json({ error: 'Pot not found' }, { status: 404 });
    }

    if (pot.user.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    pot.name = name || pot.name;
    pot.target = target || pot.target;
    pot.total = total || pot.total;
    pot.theme = theme || pot.theme;
    await pot.save();
    return NextResponse.json({ data: pot });
}

// DELETE for a single pot
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { id } = params;
    await dbConnect();

    const pot = await Pot.findById(id);
    if (!pot) {
        return NextResponse.json({ error: 'Pot not found' }, { status: 404 });
    }

    if (pot.user.toString() !== user._id.toString()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await pot.deleteOne();
    return NextResponse.json({ message: 'Pot deleted successfully' });
}
