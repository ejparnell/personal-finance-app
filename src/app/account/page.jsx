'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'

import LogoutButton from '@/components/LogoutButton'


export default function AccountPage() {
    const { data: session } = useSession()

    if (session) {
        return (
            <main>
                <h1>Auth Page</h1>
                <LogoutButton />
            </main>
        )
    } 

    return (
        <main>
            <h1>Auth Page</h1>
            <Link href='/signin'>Sign In</Link>
            <Link href='/signup'>Sign Up</Link>
        </main>
    )
}