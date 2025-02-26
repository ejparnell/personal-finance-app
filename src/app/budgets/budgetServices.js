import { defaultBudgets, defaultTransactions } from '../defaultData'

// Fetch budgets and transactions from the API or localStorage
export async function fetchBudgetsAndTransaction(session) {
    if (session) {
        console.log('session', session)
        const budgets = await fetch('/api/budgets')
        const transactions = await fetch('/api/transactions')
        if (!budgets.ok || !transactions.ok) {
            throw new Error('Failed to fetch budgets and transactions')
        }
        const budgetsData = await budgets.json()
        const transactionsData = await transactions.json()
        return { budgets: budgetsData.budgets, transactions: transactionsData.transactions }
    } else {
        const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions'))
        const storedBudgets = JSON.parse(localStorage.getItem('defaultBudgets'))
        if (!storedTransactions) {
            localStorage.setItem('defaultTransactions', JSON.stringify(defaultTransactions))
        }
        if (!storedBudgets) {
            localStorage.setItem('defaultBudgets', JSON.stringify(defaultBudgets))
        }
        return { budgets: storedBudgets || defaultBudgets, transactions: storedTransactions || defaultTransactions }
    }
}

export async function createBudget(session, formData) {
    if (session) {
        const response = await fetch('/api/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (!response.ok) {
            throw new Error('Failed to create budget')
        }
        return response.json()
    } else {
        const storedBudgets = JSON.parse(localStorage.getItem('defaultBudgets'))
        formData._id = Math.random().toString(36).substr(2, 9)
        const updatedBudgets = [...storedBudgets, formData]
        localStorage.setItem('defaultBudgets', JSON.stringify(updatedBudgets))
        return { budgets: updatedBudgets }
    }
}