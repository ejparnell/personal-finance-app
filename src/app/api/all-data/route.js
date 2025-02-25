import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Account from '@/models/Account'
import Budget from '@/models/Budget'
import Pot from '@/models/Pot'
import Transaction from '@/models/Transaction'
import RecurringBill from '@/models/RecurringBill'

export async function GET(request) {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const accounts = await Account.findOne({ user: session.user._id })
        const transactions = await Transaction.find({ user: session.user._id })
        const budgets = await Budget.find({ user: session.user._id })
        const pots = await Pot.find({ user: session.user._id })
        const recurringBills = await RecurringBill.find({ user: session.user._id })

        return NextResponse.json({
            account,
            transactions,
            budgets,
            pots,
            recurringBills,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}