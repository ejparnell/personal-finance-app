import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getTransactionsByUser, createTransaction } from '@/lib/transactionActions'

export async function GET(request) {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const transactions = await getTransactionsByUser(session.user.email)
        return NextResponse.json({ transactions })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }    
}

export async function POST(request) {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const transaction = await createTransaction(session.user.email, await request.json())

        return NextResponse.json({ message: 'Transaction created successfully', transaction })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}