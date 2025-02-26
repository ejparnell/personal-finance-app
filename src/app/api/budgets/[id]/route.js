import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Budget from '@/models/Budget'
import User from '@/models/User'

export async function PATCH(request, { params }) {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentUser = await User.findOne({ email: session.user.email })
    const budget = await Budget.findById(id)

    if (!budget || budget.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Budget not found or not authorized' }, { status: 404 })
    }

    try {
        const updates = await request.json()
        Object.assign(budget, updates)
        await budget.save()
        const budgets = await Budget.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Budget updated successfully', budgets })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentUser = await User.findOne({ email: session.user.email })
    const budget = await Budget.findById(id)

    if (!budget || budget.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Budget not found or not authorized' }, { status: 404 })
    }

    try {
        await budget.deleteOne()
        const budgets = await Budget.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Budget deleted successfully', budgets })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}