import { defaultTransactions } from '@/app/defaultData'

const defaultRecurringBills = defaultTransactions.filter(transaction => transaction.recurring)

export async function fetchRecurringBills(session) {
    if (session) {
        const response = await fetch('/api/recurring-bills')
        if (!response.ok) {
            throw new Error('Failed to fetch recurring bills')
        }
        return response.json()
    } else {
        const storedRecurringBills = JSON.parse(localStorage.getItem('defaultRecurringBills'))
        return { recurringBills: storedRecurringBills || defaultRecurringBills }
    }
}