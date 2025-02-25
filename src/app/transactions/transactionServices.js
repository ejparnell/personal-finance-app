import { defaultTransactions } from '@/app/defaultData'

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