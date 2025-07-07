import { NextResponse } from 'next/server';
import { getPots, createPot } from '@/actions/pots';

export async function GET() {
    const potsState = await getPots();

    if (potsState.potError) {
        return NextResponse.json(
            { error: potsState.potError },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: potsState.pots });
}

export async function POST(request: Request) {
    const { name, target, total, theme } = await request.json();

    const potsState = await createPot({ name, target, total, theme });

    if (potsState.potError) {
        return NextResponse.json(
            { error: potsState.potError },
            { status: 500 }
        );
    }

    return NextResponse.json({ data: potsState.pot });
}
