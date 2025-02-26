import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import RecurringBill from '@/models/RecurringBill'
import User from '@/models/User'

export async function PATCH(request, { params }) {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentUser = await User.findOne({ email: session.user.email })
    const recurringBill = await RecurringBill.findById(id)

    if (!recurringBill || recurringBill.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Recurring bill not found or not authorized' }, { status: 404 })
    }

    try {
        const updates = await request.json()
        Object.assign(recurringBill, updates)
        await recurringBill.save()
        const recurringBills = await RecurringBill.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Recurring bill updated successfully', recurringBills })
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
    const recurringBill = await RecurringBill.findById(id)

    if (!recurringBill || recurringBill.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Recurring bill not found or not authorized' }, { status: 404 })
    }

    try {
        await recurringBill.deleteOne()
        const recurringBills = await RecurringBill.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Recurring bill deleted successfully', recurringBills })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}