import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getRecurringBillsByUser, createRecurringBill } from '@/lib/recurringBillActions'

export async function GET(request) {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const recurringBills = await getRecurringBillsByUser(session.user.email)
        return NextResponse.json({ recurringBills })
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
        const data = await request.json()
        const recurringBills = await createRecurringBill(session.user.email, data)
        return NextResponse.json({ recurringBills })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

