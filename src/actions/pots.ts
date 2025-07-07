'use server';

import { dbConnect } from '@/lib/dbConnect';
import { Pot } from '@/models/Pot';
import { PotsState, PotState, PotLean } from '@/types/pot';
import { PotInput } from '@/schemas/pot';
import { getSession } from './auth';
import { PotDoc } from '@/models/Pot';
import { toMinorUnit } from '@/lib/currencyFunctions';

function formatPot(pot: PotDoc): PotLean {
    return {
        _id: pot._id.toString(),
        user: pot.user.toString(),
        name: pot.name,
        target: pot.target,
        total: pot.total,
        theme: pot.theme ?? '',
        createdAt: pot.createdAt.toISOString(),
        updatedAt: pot.updatedAt.toISOString(),
    };
}

export async function getPots(): Promise<PotsState> {
    const validUser = await getSession();
    if (!validUser) {
        return { potError: 'Unauthorized', pots: [] };
    }

    try {
        await dbConnect();

        const pots = await Pot.find({ user: validUser._id });

        const formattedPots = pots.map((pot: PotDoc) => formatPot(pot));

        return { pots: formattedPots, potError: null };
    } catch (error) {
        console.error('Error fetching pots:', error);
        return { potError: 'Failed to fetch pots', pots: [] };
    }
}

export async function createPot(data: PotInput): Promise<PotState> {
    const validUser = await getSession();
    if (!validUser) {
        return { potError: 'Unauthorized', pot: null };
    }

    try {
        await dbConnect();

        const newPot = await Pot.create({
            user: validUser._id,
            name: data.name,
            target: toMinorUnit(data.target),
            total: toMinorUnit(data.total),
            theme: data.theme,
        });

        const formattedPot = formatPot(newPot);

        return { pot: formattedPot, potError: null };
    } catch (error) {
        console.error('Error creating pot:', error);
        return { potError: 'Failed to create pot', pot: null };
    }
}

export async function updatePot(id: string, data: PotInput): Promise<PotState> {
    const validUser = await getSession();
    if (!validUser) {
        return { potError: 'Unauthorized', pot: null };
    }

    try {
        await dbConnect();

        const updatedPot = await Pot.findOneAndUpdate(
            { _id: id, user: validUser._id },
            data,
            { new: true }
        );

        if (!updatedPot) {
            return { potError: 'Pot not found or unauthorized', pot: null };
        }

        const formattedPot = formatPot(updatedPot);

        return { pot: formattedPot, potError: null };
    } catch (error) {
        console.error('Error updating pot:', error);
        return { potError: 'Failed to update pot', pot: null };
    }
}

export async function deletePot(id: string): Promise<PotState> {
    const validUser = await getSession();
    if (!validUser) {
        return { potError: 'Unauthorized', pot: null };
    }

    try {
        await dbConnect();

        const deletedPot = await Pot.findOneAndDelete({
            _id: id,
            user: validUser._id,
        });

        if (!deletedPot) {
            return { potError: 'Pot not found or unauthorized', pot: null };
        }

        const formattedPot = formatPot(deletedPot);

        return { pot: formattedPot, potError: null };
    } catch (error) {
        console.error('Error deleting pot:', error);
        return { potError: 'Failed to delete pot', pot: null };
    }
}
