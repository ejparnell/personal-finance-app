'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

import LogoutButton from '../LogoutButton'

export default function Nav() {
    const { data: session } = useSession()
    return (
        <nav className='nav'>
            <Link href='/'>Overview</Link>
            <Link href='/transactions'>Transactions</Link>
            <Link href='/budgets'>Budgets</Link>
            <Link href='/pots'>Pots</Link>
            <Link href='/recurring-bills'>Recurring Bills</Link>
            {session ? <LogoutButton /> :
                <>
                    <Link href='/signin'>Sign In</Link>
                    <Link href='/signup'>Sign Up</Link>
                </>
            }
        </nav>
    )
}