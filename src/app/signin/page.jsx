'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignInPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async e => {
        e.preventDefault()
        setError('')

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false
        })

        if (result.error) {
            setError('Invalid credentials')
        }
        else {
            router.push('/')
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
            <h1>Sign In</h1>
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
                    Sign In
                </button>
            </form>
            {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        </div>
    )
}
