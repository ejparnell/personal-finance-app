import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import connectToDatabase from '@/lib/mongodb'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import Pot from '@/models/Pot'
import User from '@/models/User'

export async function PATCH(request, { params }) {
    await connectToDatabase()
    const session = await getServerSession(authOptions)
    const { id } = await params

    if (!session) {
        return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const currentUser = await User.findOne({ email: session.user.email })
    const pot = await Pot.findById(id)

    if (!pot || pot.user.toString() !== currentUser._id.toString()) {
        return NextResponse.json({ error: 'Pot not found or not authorized' }, { status: 404 })
    }

    try {
        const updates = await request.json()
        Object.assign(pot, updates)
        await pot.save()
        const pots = await Pot.find({ user: currentUser._id })
        return NextResponse.json({ message: 'Pot updated successfully', pots })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
