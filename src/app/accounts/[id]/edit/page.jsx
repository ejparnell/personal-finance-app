'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function EditAccountPage () {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [account, setAccount] = useState(null)
  const [current, setCurrent] = useState(0)
  const [income, setIncome] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
    if (status === 'authenticated') {
      fetchAccount()
    }
  }, [status, params.id])

  const fetchAccount = async () => {
    try {
      const res = await fetch(`/api/accounts/${params.id}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error fetching account')
      }
      else {
        setAccount(data.account)
        setCurrent(data.account.current)
        setIncome(data.account.income)
        setExpenses(data.account.expenses)
      }
    }
    catch (err) {
      setError('An error occurred while fetching the account')
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`/api/accounts/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current, income, expenses })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error updating account')
      }
      else {
        setSuccess('Account updated successfully')
        // Optionally, redirect back to the accounts list after updating
        router.push('/accounts')
      }
    }
    catch (err) {
      setError('An error occurred while updating the account')
    }
  }

  if (status === 'loading') return <p>Loading...</p>
  if (!account) return <p>Loading account details...</p>

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '2rem' }}>
      <h1>Edit Account</h1>
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
          Update Account
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
    </div>
  )
}
