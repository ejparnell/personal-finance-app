import { defaultTransactions } from '@/app/defaultData'

// Get the default recurring bills from the default transactions
const defaultRecurringBills = defaultTransactions.filter(transaction => transaction.recurring)

// Fetch recurring bills from the API or localStorage
export async function fetchRecurringBills(session) {
    if (session) {
        const response = await fetch('/api/recurring-bills')
        if (!response.ok) {
            throw new Error('Failed to fetch recurring bills')
        }
        return response.json()
    } else {
        const storedRecurringBills = JSON.parse(localStorage.getItem('defaultRecurringBills'))

        if (!storedRecurringBills) {
            localStorage.setItem('defaultRecurringBills', JSON.stringify(defaultRecurringBills))
            return { recurringBills: defaultRecurringBills }
        }

        return { recurringBills: storedRecurringBills || defaultRecurringBills }
    }
}

// Create a new recurring bill in the API or localStorage
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

// Update a recurring bill in the API or localStorage
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

// Delete a recurring bill in the API or localStorage
export async function deleteRecurringBill(session, recurringBillId) {
    if (session) {
        const response = await fetch(`/api/recurring-bills/${recurringBillId}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete recurring bill')
        }

        return response.json()
    } else {
        const storedRecurringBills = JSON.parse(localStorage.getItem('defaultRecurringBills'))
        const updatedRecurringBills = storedRecurringBills.filter(recurringBill => recurringBill._id !== recurringBillId)
        localStorage.setItem('defaultRecurringBills', JSON.stringify(updatedRecurringBills))
        
        return { recurringBills: updatedRecurringBills }
    }
}