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

export async function createRecurringBill(session, formData) {
    if (session) {
        const response = await fetch('/api/recurring-bills', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (!response.ok) {
            throw new Error('Failed to create recurring bill')
        }
        return response.json()
    } else {
        const storedRecurringBills = JSON.parse(localStorage.getItem('defaultRecurringBills'))
        formData._id = Math.random().toString(36).substr(2, 9)
        const updatedRecurringBills = [...storedRecurringBills, formData]
        localStorage.setItem('defaultRecurringBills', JSON.stringify(updatedRecurringBills))
        return { recurringBills: updatedRecurringBills }
    }
}

export async function updateRecurringBill(session, recurringBillId, formData) {
    if (session) {
        const response = await fetch(`/api/recurring-bills/${recurringBillId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        if (!response.ok) {
            throw new Error('Failed to update recurring bill')
        }
        return response.json()
    } else {
        const storedRecurringBills = JSON.parse(localStorage.getItem('defaultRecurringBills'))
        const updatedRecurringBills = storedRecurringBills.map(recurringBill => {
            if (recurringBill._id === recurringBillId) {
                return { ...recurringBill, ...formData }
            }
            return recurringBill
        })
        localStorage.setItem('defaultRecurringBills', JSON.stringify(updatedRecurringBills))
        return { recurringBills: updatedRecurringBills }
    }
}