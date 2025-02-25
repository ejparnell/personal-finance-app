import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import User from '@/models/User'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function DELETE(request, { params }) {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentUser = await User.findOne({ email: session.user.email })
    const transaction = await Transaction.findById(id)

    if (!transaction || transaction.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Transaction not found or not authorized' }, { status: 404 })
    }

    try {
        await transaction.deleteOne()
        const transactions = await Transaction.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Transaction deleted successfully', transactions })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PATCH(request, { params }) {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentUser = await User.findOne({ email: session.user.email })
    const transaction = await Transaction.findById(id)

    if (!transaction || transaction.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Transaction not found or not authorized' }, { status: 404 })
    }

    try {
        const updates = await request.json()
        Object.assign(transaction, updates)
        await transaction.save()
        const transactions = await Transaction.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Transaction updated successfully', transactions })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}