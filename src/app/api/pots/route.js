import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getPotsByUser } from '@/lib/potActions'

export async function GET(request) {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const pots = await getPotsByUser(session.user.email)
        return NextResponse.json({ pots })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}