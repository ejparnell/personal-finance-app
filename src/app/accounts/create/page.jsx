'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function CreateAccountPage () {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // If the user is not authenticated, redirect to sign in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, income, expenses })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong')
      }
      else {
        setSuccess('Account created successfully')
        // Optionally, redirect to a different page or reset the form
      }
    }
    catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h1>Create Account</h1>
      <form onSubmit={handleSubmit}>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Current:
          <input
            type='number'
            value={current}
            onChange={e => setCurrent(Number(e.target.value))}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Income:
          <input
            type='number'
            value={income}
            onChange={e => setIncome(Number(e.target.value))}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <label style={{ display: 'block', marginBottom: '1rem' }}>
          Expenses:
          <input
            type='number'
            value={expenses}
            onChange={e => setExpenses(Number(e.target.value))}
            required
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </label>
        <button type='submit' style={{ padding: '0.5rem 1rem' }}>
          Create Account
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
    </div>
  )
}
