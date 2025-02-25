import {
    defaultAccount,
    defaultTransactions,
    defaultBudgets,
    defaultPots,
} from '@/app/defaultData'

export async function fetchAllData(session) {
    if (session) {
        const response = await fetch('/api/all-data')
        if (!response.ok) {
            throw new Error('Failed to fetch all data')
        }
        return response.json()
    } else {
        const storedAccount = JSON.parse(localStorage.getItem('defaultAccount'))
        const storedTransactions = JSON.parse(localStorage.getItem('defaultTransactions'))
        const storedBudgets = JSON.parse(localStorage.getItem('defaultBudgets'))
        const storedPots = JSON.parse(localStorage.getItem('defaultPots'))
        const storedRecurringBills = JSON.parse(localStorage.getItem('defaultRecurringBills'))
        const defaultRecurringBills = defaultTransactions.filter(transaction => transaction.recurring)
        
        if (!storedAccount) {
            localStorage.setItem('defaultAccount', JSON.stringify(defaultAccount))
        }
        if (!storedTransactions) {
            localStorage.setItem('defaultTransactions', JSON.stringify(defaultTransactions))
        }
        if (!storedBudgets) {
            localStorage.setItem('defaultBudgets', JSON.stringify(defaultBudgets))
        }
        if (!storedPots) {
            localStorage.setItem('defaultPots', JSON.stringify(defaultPots))
        }
        if (!storedRecurringBills) {
            localStorage.setItem('defaultRecurringBills', JSON.stringify(defaultRecurringBills))
        }

         

        return {
            account: storedAccount || defaultAccount,
            transactions: storedTransactions || defaultTransactions,
            budgets: storedBudgets || defaultBudgets,
            pots: storedPots || defaultPots,
            recurringBills: storedRecurringBills || defaultRecurringBills,
        }
    }
}