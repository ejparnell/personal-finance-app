'use server';

import { getServerSession } from 'next-auth';
import { dbConnect } from '@/lib/dbConnect';
import { authOptions } from '@/lib/authOptions';
import { Pot } from '@/models/Pot';
import { PotType, PotsState } from '@/types/pot';

export async function getPots(): Promise<PotsState | never> {
    const session = await getServerSession(authOptions);
    if (!session) {
        return { potError: 'Unauthorized', pots: [] };
    }

    try {
        await dbConnect();

        const pots = await Pot.find({ userId: session.user.id }).sort({
            createdAt: -1,
        });
        const formattedPots = pots.map(
            (pot) =>
                ({
                    _id: pot._id.toString(),
                    user: pot.user.toString(),
                    name: pot.name,
                    target: pot.target,
                    total: pot.total,
                    theme: pot.theme,
                }) as PotType
        );

        return { pots: formattedPots, potError: null };
    } catch (error) {
        console.error('Error fetching pots:', error);
        return { potError: 'Failed to fetch pots', pots: [] };
    }
}
