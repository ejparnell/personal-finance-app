import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectToDatabase from '@/lib/mongodb'
import User from '@/models/User'
import { createAccount } from '@/lib/accountActions'

export async function POST(request) {
    await connectToDatabase()

    try {
        const { email, password } = await request.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ email, password: hashedPassword })

        await createAccount(email, { current: 0, income: 0, expenses: 0 })

        return NextResponse.json({ message: 'User created successfully', user: { id: newUser._id, email: newUser.email } })
    }
    catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
