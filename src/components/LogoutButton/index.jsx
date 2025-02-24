'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        await signOut({ callbackUrl: '/signin' })
        setLoading(false)
    }

    return (
        <button 
            type="button" 
            onClick={handleLogout} 
            disabled={loading}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
        >
            {loading ? 'Logging out...' : 'Log Out'}
        </button>
    )
}