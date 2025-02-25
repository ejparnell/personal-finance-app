import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import Account from '@/models/Account'
import User from '@/models/User'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request, { params }) {
    await connectToDatabase()
    const { id } = await params
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    try {
        const account = await Account.findById(id)
        const currentUser = await User.findOne({ email: session.user.email })

        if (!account || account.user.toString() !== currentUser._id.toString()) {
            return NextResponse.json({ error: 'Account not found or not authorized' }, { status: 404 })
        }

        return NextResponse.json({ account })
    } catch (error) {
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
    const account = await Account.findById(id)

    if (!account || account.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Account not found or not authorized' }, { status: 404 })
    }

    try {
        const updates = await request.json()
        Object.assign(account, updates)
        await account.save()
        return NextResponse.json({ message: 'Account updated successfully', account })
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
    const account = await Account.findById(id)
    
    if (!account || account.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Account not found or not authorized' }, { status: 404 })
    }

    try {
        await Account.deleteOne({ _id: id })
        return NextResponse.json({ message: 'Account deleted successfully' })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
