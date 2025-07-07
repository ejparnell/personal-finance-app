import { NextResponse } from 'next/server';
import { updatePot, deletePot } from '@/actions/pots';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const { name, target, total, theme } = await request.json();

    const potsState = await updatePot(id, { name, target, total, theme });

    if (potsState.potError) {
        return NextResponse.json(
            { error: potsState.potError },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: potsState.pot });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const potsState = await deletePot(id);

    if (potsState.potError) {
        return NextResponse.json(
            { error: potsState.potError },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: potsState.pot });
}
