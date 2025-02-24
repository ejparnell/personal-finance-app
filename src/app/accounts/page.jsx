'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AccountsPage () {
  const { data: session, status } = useSession()
  const [accounts, setAccounts] = useState([])
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
    if (status === 'authenticated') {
      fetchAccounts()
    }
  }, [status])

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts')
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error fetching accounts')
      }
      else {
        setAccounts(data.accounts)
      }
    }
    catch (err) {
      setError('An error occurred while fetching accounts')
    }
  }

  const handleDelete = async id => {
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error deleting account')
      }
      else {
        // Remove the deleted account from the list
        setAccounts(accounts.filter(account => account._id !== id))
      }
    }
    catch (err) {
      setError('An error occurred while deleting the account')
    }
  }

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Your Accounts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => router.push('/accounts/create')} style={{ marginBottom: '1rem' }}>
        Create New Account
      </button>
      <ul>
        {accounts.map(account => (
          <li key={account._id} style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '1rem' }}>
            <p>Current: {account.current}</p>
            <p>Income: {account.income}</p>
            <p>Expenses: {account.expenses}</p>
            <button onClick={() => router.push(`/accounts/${account._id}/edit`)}>Edit</button>
            <button onClick={() => handleDelete(account._id)} style={{ marginLeft: '1rem' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
