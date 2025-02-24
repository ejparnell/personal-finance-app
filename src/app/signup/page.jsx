'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Something went wrong')
            }
            else {
                // After successful sign up, redirect to sign in page (create a sign in page or use NextAuth's default)
                router.push('/signin')
            }
        }
        catch (err) {
            setError('An error occurred. Please try again.')
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                    Email:
                    <input
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                    />
                </label>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                    Password:
                    <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
                    />
                </label>
                <button type='submit' style={{ padding: '0.5rem 1rem' }}>
                    Sign Up
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    )
}
