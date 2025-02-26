import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getBudgetsByUser, createBudget } from '@/lib/budgetActions'

export async function GET(request) {
    await connectToDatabase()

    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const budgets = await getBudgetsByUser(session.user.email)
        return NextResponse.json({ budgets })
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
        await createBudget(session.user.email, await request.json())
        const budgets = await getBudgetsByUser(session.user.email)

        return NextResponse.json({ message: 'Budget created successfully', budgets })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}