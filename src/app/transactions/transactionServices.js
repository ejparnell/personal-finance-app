import { defaultTransactions } from '@/app/defaultData'

// Fetch transactions from the API or localStorage
export async function fetchTransactions(session) {
    if (session) {
        const response = await fetch('/api/transactions')
        if (!response.ok) {
            throw new Error('Failed to fetch transactions')
        }
        return response.json()
    } else {
        const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions'))
        if (!storedTransactions) {
            localStorage.setItem('defaultTransactions', JSON.stringify(defaultTransactions))
            return { transactions: defaultTransactions }
        }
        return { transactions: storedTransactions }
    }
}

// Create a new transaction in the API or localStorage
export async function createTransaction(session, formData) {
    if (session) {
        const response = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (!response.ok) {
            throw new Error('Failed to create transaction')
        }
        return response.json()
    } else {
        const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions'))
        formData._id = Math.random().toString(36).substr(2, 9)
        const updatedTransactions = [...storedTransactions, formData]
        localStorage.setItem('defaultTransactions', JSON.stringify(updatedTransactions))
        return { transaction: updatedTransactions }
    }
}

export async function deleteTransaction(session, transactionId) {
    if (session) {
        const response = await fetch(`/api/transactions/${transactionId}`, {
            method: 'DELETE',
        })
        if (!response.ok) {
            throw new Error('Failed to delete transaction')
        }
        return response.json()
    } else {
        const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions'))
        const updatedTransactions = storedTransactions.filter(transaction => transaction._id !== transactionId)
        localStorage.setItem('defaultTransactions', JSON.stringify(updatedTransactions))
        return { transactions: updatedTransactions }
    }
}

export async function updateTransaction(session, transactionId, formData) {
    if (session) {
        const response = await fetch(`/api/transactions/${transactionId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (!response.ok) {
            throw new Error('Failed to update transaction')
        }
        return response.json()
    } else {
        const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions'))
        const updatedTransactions = storedTransactions.map(transaction => {
            if (transaction._id === transactionId) {
                return { ...transaction, ...formData }
            }
            return transaction
        })
        localStorage.setItem('defaultTransactions', JSON.stringify(updatedTransactions))
        return { transactions: updatedTransactions }
    }
}